import { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import { useMoralisCloudFunction, useMoralis } from "react-moralis";

const ChessboardMemo = memo(Chessboard);

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const DEFAULT_GAME = new Chess(DEFAULT_FEN);

const LiveBoard = ({
	user,
	boardWidth,
	liveGameAttributes,
	liveGameId,
	liveGamePGN,
	playerSide,
}) => {
	const chessboardRef = useRef();

	const [game, setGame] = useState(DEFAULT_GAME);
	const gameHistory = useMemo(() => game.history({ verbose: true }), [game]);
	const historySquareStyles = useMemo(() => {
		return gameHistory
			? {
					[gameHistory[gameHistory.length - 2]?.from]: {
						backgroundColor: "rgba(255, 255, 0, 0.3)",
					},
					[gameHistory[gameHistory.length - 2]?.to]: {
						backgroundColor: "rgba(255, 255, 0, 0.5)",
					},

					[gameHistory[gameHistory.length - 1]?.from]: {
						backgroundColor: "rgba(0, 89, 255, 0.3)",
					},
					[gameHistory[gameHistory.length - 1]?.to]: {
						backgroundColor: "rgba(0, 89, 255, 0.5)",
					},
			  }
			: {};
	}, [gameHistory]);

	const liveGameObj = useMemo(() => {
		if (liveGameAttributes?.pgn) {
			const _chess = new Chess();
			_chess.load_pgn(liveGameAttributes.pgn);
			return _chess;
		} else {
			return DEFAULT_GAME;
		}
	}, [liveGameAttributes]);

	const { Moralis } = useMoralis();

	useEffect(() => {
		if (liveGameObj) setGame(liveGameObj);
	}, [liveGameObj]);

	const [rightClickedSquares, setRightClickedSquares] = useState({});
	const [moveSquares, setMoveSquares] = useState({});
	const [optionSquares, setOptionSquares] = useState({});
	const [moveFrom, setMoveFrom] = useState("");

	function safeGameMutate(modify) {
		setGame((g) => {
			const update = { ...g };
			modify(update);
			return update;
		});
	}

	function onDrop(sourceSquare, targetSquare) {
		const gameCopy = { ...game };
		const move = gameCopy.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: "q", // always promote to a queen for example simplicity
		});
		setGame(gameCopy);
		// illegal move
		if (move === null) return false;
		sendMove(move);
		return true;
	}

	function getMoveOptions(square) {
		const moves = game.moves({
			square,
			verbose: true,
		});
		if (moves.length === 0) {
			return;
		}

		const newSquares = {};
		moves.map((move) => {
			newSquares[move.to] = {
				background:
					game.get(move.to) &&
					game.get(move.to).color !== game.get(square).color
						? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
						: "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
				borderRadius: "50%",
			};
			return move;
		});
		newSquares[square] = {
			background: "rgba(255, 255, 0, 0.4)",
		};
		setOptionSquares(newSquares);
	}

	async function onSquareClick(square) {
		setRightClickedSquares({});
		setOptionSquares({});

		function resetFirstMove(square) {
			setMoveFrom(square);
			getMoveOptions(square);
		}
		// from square
		if (!moveFrom) {
			resetFirstMove(square);
			return;
		}
		// attempt to make move
		const gameCopy = { ...game };
		const move = gameCopy.move({
			from: moveFrom,
			to: square,
			promotion: "q", // always promote to a queen for example simplicity
		});

		setGame(gameCopy);

		// if invalid, setMoveFrom and getMoveOptions
		if (move === null) {
			resetFirstMove(square);
			return;
		}
		sendMove(move);

		setOptionSquares({});
	}
	console.log(historySquareStyles, rightClickedSquares);
	const sendMove = useCallback(
		async (move) => {
			try {
				await Moralis.Cloud.run("sendMove", {
					move: move.san,
					gameId: liveGameId,
				});
			} catch (e) {
				safeGameMutate((game) => {
					game.undo();
				});
				chessboardRef.current.clearPremoves();
				setMoveSquares({});
			}
		},
		[Moralis, liveGameId]
	);

	function onSquareRightClick(square) {
		const colour = "rgba(0, 0, 255, 0.4)";
		setRightClickedSquares({
			...rightClickedSquares,
			[square]:
				rightClickedSquares[square] &&
				rightClickedSquares[square].backgroundColor === colour
					? undefined
					: { backgroundColor: colour },
		});
	}

	return (
		<div className="board">
			<ChessboardMemo
				arePiecesDraggable={!!user}
				isDraggablePiece={(piece) => piece.piece[0] === playerSide}
				boardOrientation={playerSide === "w" ? "white" : "black"}
				boardWidth={boardWidth}
				animationDuration={300}
				position={game.fen()}
				onSquareClick={onSquareClick}
				onSquareRightClick={onSquareRightClick}
				onPieceDrop={onDrop}
				customDarkSquareStyle={{ backgroundColor: "#6ABB72" }}
				customLightSquareStyle={{ backgroundColor: "#f9ffe4" }}
				customBoardStyle={{
					borderRadius: "4px",
					boxShadow: "0 0px 15px rgba(0, 0, 0, 0.25)",
				}}
				customSquareStyles={{
					...moveSquares,
					...optionSquares,
					...rightClickedSquares,
					...historySquareStyles,
				}}
				ref={chessboardRef}
			/>
		</div>
	);
};
export default LiveBoard;

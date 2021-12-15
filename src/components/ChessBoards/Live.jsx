import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { Chessboard } from "react-chessboard";
import { useMoralis } from "react-moralis";
import useBoardWidth from "../../hooks/useBoardWidth";
import useSound from "use-sound";

import ErrorSound from "../../assets/chess_audio/Error.mp3";
import { LiveChessContext } from "../../context/LiveChessContext";
// import useSkinData from "../../hooks/useSkinData";

const LiveBoard = () => {
	const boardWidth = useBoardWidth();
	const chessboardRef = useRef();
	const { gameHistory, game, setGame, gameId, userSide, skins } =
		useContext(LiveChessContext);

	const [playError] = useSound(ErrorSound);

	const [historySquareStyles, setHistorySquareStyles] = useState([]);
	const [checkStyles, setCheckStyles] = useState([]);

	useEffect(() => {
		setHistorySquareStyles(() => {
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
		});
	}, [gameHistory]);

	useEffect(() => {
		if (game.in_checkmate() || game.in_check()) {
			if (game.turn() === "w") {
				setCheckStyles({
					[kingPositions(game).w]: {
						backgroundColor: "rgba(255, 0, 0, 0.6)",
					},
				});
			} else {
				setCheckStyles({
					[kingPositions(game).b]: {
						backgroundColor: "rgba(255, 0, 0, 0.6)",
					},
				});
			}
		} else {
			setCheckStyles({});
		}
	}, [game]);

	const { Moralis } = useMoralis();
	const [rightClickedSquares, setRightClickedSquares] = useState({});
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
		// illegal move
		if (move === null) return false;
		setGame(gameCopy);
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

		if (move === null) {
			resetFirstMove(square);
			return;
		}
		setGame(gameCopy);
		// if invalid, setMoveFrom and getMoveOptions
		sendMove(move);

		setOptionSquares({});
	}

	const sendMove = useCallback(
		async (move) => {
			try {
				await Moralis.Cloud.run("sendMove", {
					move: move.san,
					gameId: gameId,
				});
			} catch (e) {
				playError();
				safeGameMutate((game) => {
					game.undo();
				});
				chessboardRef.current.clearPremoves();
			}
		},
		[Moralis, gameId]
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

	const customPieces = useCallback(
		(squareWidth) => {
			// console.log(skins);
			const moralisPieceSkins = {};
			if (skins) {
				Object.keys(skins).forEach((p) => (moralisPieceSkins[p] = skins[p]));
			}

			const paths = {
				...DEFAULT_PIECES_PATHS,
				...moralisPieceSkins,
			};
			// console.log(paths);
			const newPieces = {};

			Object.keys(DEFAULT_PIECES_PATHS).forEach((p) => {
				newPieces[p] = () => (
					<img
						style={{ width: squareWidth, height: squareWidth }}
						src={paths[p]}
						alt={p}
						className="chess-piece"
					/>
				);
			});
			return newPieces;
		},
		[skins]
	);

	return (
		<div className="board">
			<Chessboard
				arePiecesDraggable={!!gameId}
				isDraggablePiece={(piece) => piece.piece[0] === userSide}
				boardOrientation={userSide === "w" ? "white" : "black"}
				boardWidth={boardWidth}
				animationDuration={300}
				position={game.fen()}
				onSquareClick={onSquareClick}
				onSquareRightClick={onSquareRightClick}
				onPieceDrop={onDrop}
				customDarkSquareStyle={{ backgroundColor: "#6ABB72" }}
				customLightSquareStyle={{ backgroundColor: "#f9ffe4" }}
				// customDropSquareStyle={{ backgroundColor: "#ecc92c" }}
				customPieces={customPieces(boardWidth / 8 - 20)}
				customBoardStyle={{
					borderRadius: "4px",
					boxShadow: "0 0px 15px rgba(0, 0, 0, 0.25)",
				}}
				customSquareStyles={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					...historySquareStyles,
					...rightClickedSquares,
					...optionSquares,
					...checkStyles,
				}}
				ref={chessboardRef}
			/>
		</div>
	);
};

const kingPositions = (game) => {
	const a = []
		.concat(...game.board())
		.map((p, index) => {
			if (p !== null && p.type === "k") {
				return { index, color: p.color };
			}
			return {};
		})
		.filter((o) => o?.index)
		.map((king) => {
			const row = "abcdefgh"[king.index % 8];
			const column = Math.ceil((64 - king.index) / 8);
			return { c: king.color, i: row + column };
		});
	return { [a[0].c]: a[0].i, [a[1].c]: a[1].i };
};

const DEFAULT_PIECES_PATHS = {
	wP: "./assets/chess_pieces_png/wP.png",
	wN: "./assets/chess_pieces_png/wN.png",
	wB: "./assets/chess_pieces_png/wB.png",
	wR: "./assets/chess_pieces_png/wR.png",
	wQ: "./assets/chess_pieces_png/wQ.png",
	wK: "./assets/chess_pieces_png/wK.png",
	bP: "./assets/chess_pieces_png/bP.png",
	bN: "./assets/chess_pieces_png/bN.png",
	bB: "./assets/chess_pieces_png/bB.png",
	bR: "./assets/chess_pieces_png/bR.png",
	bQ: "./assets/chess_pieces_png/bQ.png",
	bK: "./assets/chess_pieces_png/bK.png",
};

export default LiveBoard;

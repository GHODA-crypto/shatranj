import { useRef, useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { useMoralis } from "react-moralis";
import { customPieces } from "./customPieces";

const LiveBoard = ({
	user,
	boardWidth,
	liveGameId,
	playerSide,
	game,
	setGame,
	gameHistory,
}) => {
	const chessboardRef = useRef();

	const [historySquareStyles, setHistorySquareStyles] = useState([]);

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

	const { Moralis } = useMoralis();

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

	const custom = customPieces();

	return (
		<div className="board">
			<Chessboard
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
				// customPieces={custom} // {"wP": jsx}
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

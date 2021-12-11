import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import { useMoralisCloudFunction, useMoralis } from "react-moralis";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const LiveBoard = ({
	user,
	boardWidth,
	liveGameAttributes,
	liveGameId,
	playerSide,
}) => {
	const chessboardRef = useRef();
	const [game, setGame] = useState(
		() => new Chess(liveGameAttributes?.fen || DEFAULT_FEN)
	);
	const { Moralis } = useMoralis();

	const liveGameObj = useMemo(
		() => new Chess(liveGameAttributes?.fen || DEFAULT_FEN),
		[liveGameAttributes]
	);
	useEffect(() => {
		setGame(liveGameObj);
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
		setMoveSquares({
			[sourceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
			[targetSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
		});
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

	function onSquareClick(square) {
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

	const sendMove = useCallback(async (move) => {
		try {
			const res = await Moralis.Cloud.run("sendMove", {
				move: move.san,
				gameId: liveGameId,
			});
			console.log(res);
		} catch (e) {
			safeGameMutate((game) => {
				game.undo();
			});
			chessboardRef.current.clearPremoves();
			setMoveSquares({});
		}
	}, []);

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
			<Chessboard
				arePiecesDraggable={!!user}
				isDraggablePiece={(piece) => piece.piece[0] === playerSide}
				boardOrientation={playerSide === "w" ? "white" : "black"}
				boardWidth={boardWidth}
				animationDuration={300}
				position={game.fen()}
				// onMouseOverSquare={onMouseOverSquare}
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
				}}
				ref={chessboardRef}
			/>
		</div>
	);
};
export default LiveBoard;

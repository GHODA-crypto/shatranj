import { useRef, useState, useEffect } from "react";
import Chess from "chess.js";

import { Chessboard } from "react-chessboard";

export function ShowBoard({ boardWidth, pgn }) {
	const chessboardRef = useRef();
	const [game, setGame] = useState(new Chess());

	function safeGameMutate(modify) {
		setGame((g) => {
			const update = { ...g };
			modify(update);
			return update;
		});
	}

	useEffect(() => {
		safeGameMutate((g) => g.load_pgn(pgn));
	}, []);

	function onDrop(sourceSquare, targetSquare) {
		const gameCopy = { ...game };
		const move = gameCopy.move({
			from: sourceSquare,
			to: targetSquare,
			promotion: "q", // always promote to a queen for example simplicity
		});
		setGame(gameCopy);
		return move;
	}

	return (
		<div>
			<Chessboard
				className="show-board"
				arePiecesDraggable={false}
				animationDuration={200}
				boardWidth={boardWidth}
				position={game.fen()}
				customBoardStyle={{
					borderRadius: "8px",
					boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.15)",
					cursor: "pointer",
				}}
				ref={chessboardRef}
			/>
		</div>
	);
}

export const GameBoard = ({ user, boardWidth }) => {
	const chessboardRef = useRef();
	const [game, setGame] = useState(new Chess());

	const [rightClickedSquares, setRightClickedSquares] = useState({});
	const [moveSquares, setMoveSquares] = useState({});
	const [optionSquares, setOptionSquares] = useState({});

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

	function onMouseOverSquare(square) {
		getMoveOptions(square);
	}

	// Only set squares to {} if not already set to {}
	function onMouseOutSquare() {
		if (Object.keys(optionSquares).length !== 0) setOptionSquares({});
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

	function onSquareClick() {
		setRightClickedSquares({});
	}

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
				arePiecesDraggable={user === null}
				arePremovesAllowed={true}
				animationDuration={200}
				boardWidth={boardWidth}
				position={game.fen()}
				onMouseOverSquare={onMouseOverSquare}
				onMouseOutSquare={onMouseOutSquare}
				onSquareClick={onSquareClick}
				onSquareRightClick={onSquareRightClick}
				onPieceDrop={onDrop}
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

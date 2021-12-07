import { useRef, useState, useEffect } from "react";
import Chess from "chess.js";

import { Chessboard } from "react-chessboard";

export default function ShowBoard({ boardWidth, pgn }) {
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
					boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
					cursor: "pointer",
				}}
				ref={chessboardRef}
			/>
		</div>
	);
}

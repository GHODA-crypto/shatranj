import { useRef, useState, useEffect } from "react";
import Chess from "chess.js";
import { Chessboard } from "react-chessboard";
import { customPieces } from "./customPieces";

function ShowBoard({ boardWidth, pgn }) {
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

	return (
		<div>
			<Chessboard
				className="show-board"
				arePiecesDraggable={false}
				animationDuration={200}
				boardWidth={boardWidth}
				position={game.fen()}
				customDarkSquareStyle={{ backgroundColor: "#6ABB72" }}
				customLightSquareStyle={{ backgroundColor: "#D3FFD8" }}
				customPieces={customPieces()}
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

export default ShowBoard;

import { useRef, useState } from "react";
import Chess from "chess.js";

import { Chessboard } from "react-chessboard";
import { customPieces } from "./customPieces";

const DisplayBoard = ({ boardWidth }) => {
	const chessboardRef = useRef();
	const [game, setGame] = useState(new Chess());

	function safeGameMutate(modify) {
		setGame((g) => {
			const update = { ...g };
			modify(update);
			return update;
		});
	}

	return (
		<div className="board">
			<Chessboard
				arePiecesDraggable={false}
				boardWidth={boardWidth}
				animationDuration={200}
				position={game.fen()}
				customDarkSquareStyle={{ backgroundColor: "#6ABB72" }}
				customLightSquareStyle={{ backgroundColor: "#D3FFD8" }}
				customPieces={customPieces()}
				customBoardStyle={{
					borderRadius: "4px",
					boxShadow: "0 0px 15px rgba(0, 0, 0, 0.25)",
				}}
				ref={chessboardRef}
			/>
		</div>
	);
};

export default DisplayBoard;

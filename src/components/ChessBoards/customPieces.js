const pieces = {
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

export const customPieces = () => {
	const returnPieces = {};
	Object.keys(pieces).forEach((p) => {
		returnPieces[p] = ({ squareWidth }) => (
			<img
				style={{ width: squareWidth, height: squareWidth }}
				src={`./assets/chess_pieces_png/${p}.png`}
				alt={p}
			/>
		);
	});
	return returnPieces;
};

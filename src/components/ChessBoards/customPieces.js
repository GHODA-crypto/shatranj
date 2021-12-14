const pieces = [
	"wP",
	"wN",
	"wB",
	"wR",
	"wQ",
	"wK",
	"bP",
	"bN",
	"bB",
	"bR",
	"bQ",
	"bK",
];

export const customPieces = () => {
	const returnPieces = {};
	pieces.forEach((p) => {
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

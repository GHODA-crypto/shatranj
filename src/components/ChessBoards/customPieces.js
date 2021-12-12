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
	pieces.map((p) => {
		returnPieces[p] = ({ squareWidth }) => (
			<img
				style={{ width: squareWidth, height: squareWidth }}
				src={`/src/assets/chess_pieces_pngs/${p}.png`}
				alt={p}
			/>
		);
		return null;
	});
	return returnPieces;
};

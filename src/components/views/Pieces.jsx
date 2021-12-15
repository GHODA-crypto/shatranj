import { useContext } from "react";
import { LiveChessContext } from "../../context/LiveChessContext";

import {
	WhiteKing,
	WhiteKnight,
	WhiteQueen,
	WhiteBishop,
	WhiteRook,
	WhitePawn,
	BlackKing,
	BlackKnight,
	BlackQueen,
	BlackBishop,
	BlackRook,
	BlackPawn,
} from "./svgs";

export const BlackCaptured = () => {
	const {
		captured: { b: capturedB },
	} = useContext(LiveChessContext);

	return (
		<>
			<div className="bp peice" id={capturedB.p === 0 ? "none" : ""}>
				{[...Array(capturedB.p)].map((_, idx) => (
					<BlackPawn key={idx} />
				))}
			</div>
			<div className="bb peice" id={capturedB.b === 0 ? "none" : ""}>
				{[...Array(capturedB.b)].map((_, idx) => (
					<BlackBishop key={idx} />
				))}
			</div>
			<div className="bn peice" id={capturedB.n === 0 ? "none" : ""}>
				{[...Array(capturedB.n)].map((_, idx) => (
					<BlackKnight key={idx} />
				))}
			</div>
			<div className="br peice" id={capturedB.r === 0 ? "none" : ""}>
				{[...Array(capturedB.r)].map((_, idx) => (
					<BlackRook key={idx} />
				))}
			</div>
			<div className="bq peice" id={capturedB.q === 0 ? "none" : ""}>
				{[...Array(capturedB.q)].map((_, idx) => (
					<BlackQueen key={idx} />
				))}
			</div>
		</>
	);
};

export const WhiteCaptured = () => {
	const {
		captured: { w: capturedW },
	} = useContext(LiveChessContext);
	return (
		<>
			<div className="bp peice" id={capturedW.p === 0 ? "none" : ""}>
				{[...Array(capturedW.p)].map((_, idx) => (
					<WhitePawn key={idx} />
				))}
			</div>
			<div className="bb peice" id={capturedW.b === 0 ? "none" : ""}>
				{[...Array(capturedW.b)].map((_, idx) => (
					<WhiteBishop key={idx} />
				))}
			</div>
			<div className="bn peice" id={capturedW.n === 0 ? "none" : ""}>
				{[...Array(capturedW.n)].map((_, idx) => (
					<WhiteKnight key={idx} />
				))}
			</div>
			<div className="br peice" id={capturedW.r === 0 ? "none" : ""}>
				{[...Array(capturedW.r)].map((_, idx) => (
					<WhiteRook key={idx} />
				))}
			</div>
			<div className="bq peice" id={capturedW.q === 0 ? "none" : ""}>
				{[...Array(capturedW.q)].map((_, idx) => (
					<WhiteQueen key={idx} />
				))}
			</div>
		</>
	);
};

export const PieceMap = {
	w: {
		k: <WhiteKing style={{ width: 10, height: 10 }} />,
		q: <WhiteQueen style={{ width: 10, height: 10 }} />,
		r: <WhiteRook style={{ width: 10, height: 10 }} />,
		b: <WhiteBishop style={{ width: 10, height: 10 }} />,
		n: <WhiteKnight style={{ width: 10, height: 10 }} />,
		p: <WhitePawn style={{ width: 10, height: 10 }} />,
	},
	b: {
		k: <BlackKing style={{ width: 10, height: 10 }} />,
		q: <BlackQueen style={{ width: 10, height: 10 }} />,
		r: <BlackRook style={{ width: 10, height: 10 }} />,
		b: <BlackBishop style={{ width: 10, height: 10 }} />,
		n: <BlackKnight style={{ width: 10, height: 10 }} />,
		p: <BlackPawn style={{ width: 10, height: 10 }} />,
	},
};

const fenToGameState = (fen) => {
	const fenArr = fen.split(" ");
	const pieces = fenArr[0].split("/");
	const board = [];
	for (let i = 0; i < 8; i++) {
		board.push(pieces[i].split(""));
	}
	const turn = fenArr[1];
	const castling = fenArr[2];
	const enPassant = fenArr[3];
	const halfMoveClock = fenArr[4];
	const fullMoveNumber = fenArr[5];
	return { board, turn, castling, enPassant, halfMoveClock, fullMoveNumber };
};

const boardToState = (b) => {
	const color = {
		w: "1",
		b: "0",
	};
	const piece = {
		p: "001",
		b: "010",
		n: "011",
		r: "100",
		q: "101",
		k: "110",
	};
	b.reverse();
	let board = "0b";
	for (let i = 7; i >= 0; i--) {
		for (let j = 7; j >= 0; j--) {
			board += b[i][j] ? color[b[i][j].color] + piece[b[i][j].type] : "0000";
		}
	}
	return BigInt(board);
};

const toBinMoves = (chess) => {
	const xToBin = {
		a: "000",
		b: "001",
		c: "010",
		d: "011",
		e: "100",
		f: "101",
		g: "110",
		h: "111",
	};
	const yToBin = {
		1: "000",
		2: "001",
		3: "010",
		4: "011",
		5: "100",
		6: "101",
		7: "110",
		8: "111",
	};

	const posToBin = (s) => {
		return yToBin[s[1]] + xToBin[s[0]];
	};

	return chess.history({ verbose: true }).map((x) => {
		const b = posToBin(x.from) + posToBin(x.to);
		return parseInt(b, 2);
	});
};

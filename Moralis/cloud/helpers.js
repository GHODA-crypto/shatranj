function hello() {
	console.log("Hello World!");
	return "Hello World!";
}
s;

const toMoves = (chess) => {
	xToBin = {
		a: "000",
		b: "001",
		c: "010",
		d: "011",
		e: "100",
		f: "101",
		g: "110",
		h: "111",
	};
	yToBin = {
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
		b = posToBin(x.from) + posToBin(x.to);
		return parseInt(b, 2);
	});
};

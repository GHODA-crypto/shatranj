function hello() {
	// console.log("Hello World!");
	return "Hello World!";
}

async function checkExistingChallenges(userEthAddress) {
	const Challenge = Moralis.Object.extend("Challenge");
	let pipeline = [
		{
			match: {
				gameStatus: { $ne: 3 },
			},
		},
		{
			match: {
				$expr: {
					$or: [
						{ $eq: ["$player1", userEthAddress] },
						{ $eq: ["$player2", userEthAddress] },
					],
				},
			},
		},
	];

	const challengesQuery = new Moralis.Query(Challenge);
	const existingChallenges = await challengesQuery.aggregate(pipeline);
	return existingChallenges;
}

// Create a new challenge
async function createNewChallenge(user, gamePreferences) {
	const Challenge = Moralis.Object.extend("Challenge");
	const newChallenge = new Challenge();

	const challengerSide = gamePreferences?.preferredSide || "any";

	newChallenge.set("player1", user.get("ethAddress"));
	newChallenge.set("gameStatus", 0);

	newChallenge.set("challengerSide", challengerSide);
	newChallenge.set("player1ELO", user.get("ELO"));
	newChallenge.set(
		"lowerElo",
		gamePreferences?.lowerElo || user.get("ELO") - 50
	);
	newChallenge.set(
		"upperElo",
		gamePreferences?.upperElo || user.get("ELO") + 50
	);

	const logger = Moralis.Cloud.getLogger();
	logger.info("Saving new challenge");
	await newChallenge.save(null, { useMasterKey: true });
	return newChallenge;
}

async function createNewGame(challenge, player1, player2) {
	const Game = Moralis.Object.extend("Game");
	const game = new Game();

	// decide player sides
	let player1Side = "";
	if (challenge.get("challengerSide") === "any")
		player1Side = Math.random() > 0.5 ? "w" : "b";
	else player1Side = challenge.get("challengerSide");

	const white = player1Side === "w" ? player1 : player2;
	const whiteElo =
		player1Side === "w"
			? challenge.get("player1ELO")
			: challenge.get("player2ELO");

	const black = player1Side === "w" ? player2 : player1;
	const blackElo =
		player1Side === "w"
			? challenge.get("player2ELO")
			: challenge.get("player1ELO");

	game.set("white", white);
	game.set("whiteELO", whiteElo);
	game.set("black", black);
	game.set("blackELO", blackElo);

	await game.save(null, { useMasterKey: true });
	return game;
}

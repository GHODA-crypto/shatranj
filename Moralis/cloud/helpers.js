async function checkExistingChallenges(userEthAddress) {
	const Challenge = Moralis.Object.extend("Challenge");
	let pipeline = [
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
		{
			match: {
				$expr: {
					$or: [
						{ $eq: ["$challengeStatus", 0] },
						{ $eq: ["$challengeStatus", 1] },
						{ $eq: ["$challengeStatus", 2] },
					],
				},
			},
		},
	];

	const challengesQuery = new Moralis.Query(Challenge);
	const challengeQuery = new Moralis.Query(Challenge);

	const existingChallenges = await challengesQuery.aggregate(pipeline);
	const logger = Moralis.Cloud.getLogger();
	if (existingChallenges?.length > 0) {
		return challengeQuery.get(existingChallenges[0]?.objectId);
	} else {
		const Game = Moralis.Object.extend("Game");

		let gamePipeline = [
			{
				match: {
					winner: userEthAddress,
				},
			},
			{
				match: {
					$expr: {
						$or: [{ $eq: ["$gameStatus", 3] }, { $eq: ["$gameStatus", 4] }],
					},
				},
			},
		];

		const gameQuery = new Moralis.Query("Game");
		const [game] = await gameQuery.aggregate(gamePipeline);
		if (game) {
			logger.info("Existing game found");
			logger.info(game);
			const challenge = await challengeQuery.get(game.challengeId);
			return challenge;
		}
	}
	// logger.info("No existing challenges found");
}

// Create a new challenge
async function createNewChallenge(user, gamePreferences) {
	const Challenge = Moralis.Object.extend("Challenge");
	const newChallenge = new Challenge();

	const challengerSide = gamePreferences?.preferredSide || "any";

	newChallenge.set("player1", user.get("ethAddress"));
	newChallenge.set("challengeStatus", 0);

	newChallenge.set("challengerSide", challengerSide);
	newChallenge.set("player1ELO", user.get("ELO"));

	const upperElo = gamePreferences?.upperElo
		? Number(user.get("ELO") + Number(gamePreferences?.upperElo))
		: Number(user.get("ELO")) + 100;
	const lowerElo = gamePreferences?.lowerElo
		? Number(user.get("ELO") - Number(gamePreferences?.lowerElo))
		: Number(user.get("ELO")) - 100;

	newChallenge.set("lowerElo", lowerElo);
	newChallenge.set("upperElo", upperElo);

	await newChallenge.save(null, { useMasterKey: true });
	return newChallenge;
}

async function createNewGame(challenge, player1, player2) {
	const Game = Moralis.Object.extend("Game");
	const game = new Game();
	game.set("challengeId", challenge.id);
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

	game.set("players", {
		w: white,
		b: black,
	});
	game.set("sides", {
		[player1]: player1Side,
		[player2]: player1Side === "w" ? "b" : "w",
	});
	game.set("ELO", {
		w: whiteElo,
		b: blackElo,
	});
	game.set("turn", "w");
	game.set("outcome", 0);
	game.set("fen", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
	game.set("pgn", " ");
	game.set("canPlay", false);

	await game.save(null, { useMasterKey: true });
	return game;
}

function getScoreChange(eloW, eloB, outcome) {
	const difference = eloW - eloB;
	const reverse = difference > 0; // note if difference was positive
	const diff = Math.abs(difference); // take absolute to lookup in positive table
	// Score change lookup table
	let scoreChange = 10;

	if (diff > 636) scoreChange = 20;
	else if (diff > 436) scoreChange = 19;
	else if (diff > 338) scoreChange = 18;
	else if (diff > 269) scoreChange = 17;
	else if (diff > 214) scoreChange = 16;
	else if (diff > 168) scoreChange = 15;
	else if (diff > 126) scoreChange = 14;
	else if (diff > 88) scoreChange = 13;
	else if (diff > 52) scoreChange = 12;
	else if (diff > 17) scoreChange = 11;
	// Depending on result (win/draw/lose), calculate score changes
	if (outcome === 3) {
		return reverse ? 20 - scoreChange : scoreChange;
	} else if (outcome === 4) {
		return reverse ? -scoreChange : scoreChange - 20;
	} else {
		return reverse ? 10 - scoreChange : scoreChange - 10;
	}
}

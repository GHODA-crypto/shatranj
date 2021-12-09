// Pool and Pairing Functions

// Join Pairing Pool
Moralis.Cloud.define(
	"getChallenge",
	async (request) => {
		const Challenge = Moralis.Object.extend("Challenge");
		const challengesQuery = new Moralis.Query(Challenge);
		const user = request.user;
		const params = request.params;

		// const logger = Moralis.Cloud.getLogger();

		// Get existing challenges
		const existingChallenges = await checkExistingChallenges(
			user.get("ethAddress")
		);
		if (existingChallenges.length) {
			// logger.info(existingChallenges);
			return existingChallenges[0];
		}

		// Get available challenge
		let pipeline = [
			{
				match: {
					gameStatus: 0,
				},
			},
			{
				match: {
					challengerSide: {
						$ne: params.gamePreferences?.preferredSide || "none",
					},
				},
			},
			{
				match: {
					upperElo: {
						$lte: params.gamePreferences?.upperElo
							? params.gamePreferences?.upperElo
							: user.get("ELO") + 50,
					},
					lowerElo: {
						$gte: params.gamePreferences?.lowerElo
							? params.gamePreferences?.lowerElo
							: user.get("ELO") - 50,
					},
				},
			},
			{ sort: { createdAt: -1 } },
			{ limit: 2 },
		];

		const challenges = await challengesQuery.aggregate(pipeline);

		// logger.info(challenges);
		if (challenges.length > 0) {
			// Join an existing challenge
			const challengeQuery = new Moralis.Query(Challenge);
			const challenge = await (
				await challengeQuery.get(challenges[0].objectId)
			).fetch();

			if (challenge.get("status") === 1) {
				return "Error Occured while joining challenge";
			}

			// set challengeStatus to confirming match
			challenge.set("gameStatus", 1);
			challenge.set("player2", user.get("ethAddress"));

			await challenge.save({ useMasterKey: true });

			return challenge;
		}

		// logger.info("Creating New Challenge");
		// No challenge found -> create new challenge
		return await createNewChallenge(user, { ...params.gamePreferences });
	},
	{
		requireUser: true,
	}
);

Moralis.Cloud.define(
	"acceptChallenge",
	async (request) => {
		const params = request.params;
		const Challenge = Moralis.Object.extend("Challenge");
		const challengesQuery = new Moralis.Query(Challenge);

		const challenge = await challengesQuery.get(hexToId(params.challengeIdHex));

		const Game = Moralis.Object.extend("Game");

		const userPlayerNumber =
			challenge.get("player1") === request.user.get("ethAddress") ? 1 : 2;
		challenge.set(`p${userPlayerNumber}proxy`, {
			proxySignature: params.signature,
			proxyAddress: params.proxyAddress,
		});

		await challenge.save({ useMasterKey: true });

		if (challenge.get("player1") && challenge.get("player2")) {
			challenge.set("gameStatus", 2);
			challenge.set("gameStatus", 3); //	---------------------remove this later

			await challenge.save({ useMasterKey: true });

			const gameQuery = new Moralis.Query(Game);
			const game = await gameQuery.get(challenge.get("gameId"));

			game.set(`p2proxyAddress`, params.proxyAddress);
			game.set(`player2`, request.user.get("ethAddress"));

			await game.save({ useMasterKey: true });
			return game.id;
		} else {
			const newGame = new Game();

			newGame.set(`player1`, request.user.get("ethAddress"));
			newGame.set(`p1proxyAddress`, params.proxyAddress);

			await newGame.save({ useMasterKey: true });

			challenge.set("gameId", newGame.id);
			challenge.set("gameStatus", 0); // challenge is now looking for a pair

			await challenge.save({ useMasterKey: true });

			return newGame.id;
		}
	},
	verifyAcceptChallenge
);

Moralis.Cloud.afterSave("Game", async (request) => {
	const challenge = request.object;
	const newGame = await createNewGame(challenge);

	// send request to api
	// const res = await Moralis.Cloud.httpRequest({
	// 	method: "POST",
	// 	url: "http://shatranj.herokuapp.com/createChallenge",
	// 	headers: {
	// 		"Content-Type": "application/json;charset=utf-8",
	// 		Authorization: "Bearer " + config.get("oracleToken"),
	// 	},
	// 	body: {
	// 		game: { gameId: newGame.id, ...newGame.attributes },
	// 	},
	// }).catch((err) => {
	// 	logger.info(err);
	// });
	// if (res.statusCode === 200) {

	challenge.set("gameStatus", 2);
	challenge.set("gameId", newGame.id);
	await challenge.save({ useMasterKey: true });
	// }

	challenge.set("gameStatus", 4);
	await challenge.save({ useMasterKey: true });

	return "Challenge could not be created";
});

// Cancel Game Join
// Moralis.Cloud.define(
// 	"cancelGameJoin",
// 	(request) => {
// 		return hello();
// 	},
// 	{
// 		requireUser: true,
// 	}
// );

// Game Functions
// Moralis.Cloud.define(
// 	"sendMove",
// 	(request) => {
// 		// Verify Signatures

// 		// Verify Move

// 		// Save Move

// 		// Check Game Status

// 		return hello();
// 	},
// 	{
// 		fields: ["boardState", "move"],
// 		requireUser: true,
// 	}
// );

// Moralis.Cloud.define(
// 	"getGame",
// 	(request) => {
// 		return hello();
// 	},
// 	{
// 		fields: ["gameID"],
// 		requireUser: true,
// 	}
// );

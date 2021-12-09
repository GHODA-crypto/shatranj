// Pool and Pairing Functions

// Join Pairing Pool
Moralis.Cloud.define(
	"getChallenge",
	async (request) => {
		const Challenge = Moralis.Object.extend("Challenge");
		const challengesQuery = new Moralis.Query(Challenge);
		const user = request.user;
		const params = request.params;

		const logger = Moralis.Cloud.getLogger();
		// Get existing challenges
		logger.info("Get existing challenges of user");

		const existingChallenges = await checkExistingChallenges(
			user.get("ethAddress")
		);
		if (existingChallenges.length) {
			return existingChallenges[0];
		}

		// logger.info("Checking for existing challenges to join");
		// Get available challenge
		let pipeline = [
			{
				match: {
					gameStatus: 0,
				},
			},
			{
				match: {
					$expr: {
						$or: [
							{ $ne: ["$player1", user.get("ethAddress")] },
							{ $ne: ["$player2", user.get("ethAddress")] },
						],
					},
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
					challengerELO: {
						$lte: params.gamePreferences?.upperElo
							? params.gamePreferences?.upperElo
							: user.get("ELO") + 50,

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

			// set challengeStatus to matching
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

		const challenge = await challengesQuery.get(params.challengeId);
		const Game = Moralis.Object.extend("Game");

		const userPlayerNumber =
			challenge.get("player1") === request.user.get("ethAddress") ? 1 : 2;

		challenge.set(`p${userPlayerNumber}proxy`, [
			{
				proxySignature: params.proxySignature,
				proxyAddress: params.proxyAddress,
			},
		]);

		await challenge.save({ useMasterKey: true });

		if (challenge.get("player1") || challenge.get("player2")) {
			challenge.set("gameStatus", 2);
			await challenge.save({ useMasterKey: true });

			const gameQuery = new Moralis.Query(Game);
			const game = await gameQuery.get(challenge.get("gameId"));

			game.set(`player${userPlayerNumber}`, [request.user.get("ethAddress")]);

			return game.id;
		} else {
			const newGame = new Game();

			challenge.set("gameId", newGame.id);
			await challenge.save({ useMasterKey: true });

			newGame.set(`player${userPlayerNumber}`, [
				request.user.get("ethAddress"),
			]);

			return newGame.id;
		}
	},
	verifyAcceptChallenge
);

// const Game = Moralis.Object.extend("Game");
// const gameQuery = new Moralis.Query(Game);
// const game = await gameQuery.get(challenge.get("gameId"));

// // decide sides of players
// const p1side =
// 	challenge.get("challengerSide") || (Math.random() < 0.5 ? "w" : "b");

// // Set Addresses and Proxies
// if (p1side === "w") {
// 	game.set("whitePlayer", challenge.get("player1"));
// 	game.set("whiteProxy", challenge.get("p1proxy"));
// 	game.set("blackPlayer", challenge.get("player2"));
// 	game.set("blackProxy", challenge.get("p2proxy"));
// } else {
// 	game.set("whitePlayer", challenge.get("player2"));
// 	game.set("whiteProxy", challenge.get("p2proxy"));
// 	game.set("blackPlayer", challenge.get("player1"));
// 	game.set("blackProxy", challenge.get("p1proxy"));
// }

// Moralis.Cloud.afterSave("Challenge", async (request) => {
// 	const challenge = request.object;
// 	const newGame = await createNewGame(challenge);

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
// challenge.set("gameStatus", 2);
// challenge.set("gameId", newGame.id);
// await challenge.save({ useMasterKey: true });
// return challenge;
// }

// challenge.set("gameStatus", 4);
// await challenge.save({ useMasterKey: true });

// return "Challenge could not be created";
// });

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

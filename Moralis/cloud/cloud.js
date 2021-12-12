// Pool and Pairing Functions

// Check if user has a live challenge
Moralis.Cloud.define(
	"doesActiveChallengeExist",
	async (request) => {
		const existingChallenges = await checkExistingChallenges(
			request.user.get("ethAddress")
		);
		if (existingChallenges.length) return true;
		return false;
	},
	{
		requireUser: true,
	}
);

// Join Pairing Pool
Moralis.Cloud.define(
	"joinLiveChess",
	async (request) => {
		const Challenge = Moralis.Object.extend("Challenge");
		const challengeQuery = new Moralis.Query(Challenge);
		const user = request.user;
		const params = request.params;

		const existingChallenges = await checkExistingChallenges(
			request.user.get("ethAddress")
		);
		if (existingChallenges.length)
			return challengeQuery.get(existingChallenges[0].objectId);

		// Get available challenge
		let pipeline = [
			{
				match: {
					challengeStatus: 0,
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
			{ limit: 1 },
		];
		const challenges = await challengeQuery.aggregate(pipeline);

		const logger = Moralis.Cloud.getLogger();
		logger.info(challenges);
		if (challenges.length > 0) {
			// Join an existing challenge
			const challenge = await challengeQuery.get(challenges[0].objectId);

			if (challenge.get("status") === 1)
				return "Oops. Somebody else joined the challenge  :(";

			// set challengeStatus to starting match
			challenge.set("player2", user.get("ethAddress"));
			challenge.set("player2ELO", user.get("ELO"));
			challenge.set("challengeStatus", 1);

			await challenge.save(null, { useMasterKey: true });

			return challenge;
		}

		// No challenge found -> create new challenge
		return await createNewChallenge(user, { ...params.gamePreferences });
	},
	{ requireUser: true }
);

Moralis.Cloud.afterSave("Challenge", async (request) => {
	const challenge = request.object;
	if (challenge.get("challengeStatus") === 1 && !challenge.get("gameId")) {
		const newGame = await createNewGame(
			challenge,
			challenge.get("player1"),
			challenge.get("player2")
		);

		// send http request for startGame tx
		// await Moralis.Cloud.httpRequest({
		// 	method: "POST",
		// 	url: "",
		// 	headers: {
		// 		"Content-Type": "application/json;charset=utf-8",
		// 	},
		// 	body: {
		// 		gameId: newGame.id,
		// 		player1: challenge.get("player1"),
		// 		player2: challenge.get("player2"),
		// 	},
		// }).then(
		// 	async function (httpResponse) {
		// 		console.log(httpResponse.text);
		// 		challenge.set("gameId", newGame.id);
		// 		await challenge.save(null,{ useMasterKey: true });
		// 	},
		// 	async function (httpResponse) {
		// 		challenge.set("challengeStatus", 10);
		// 		challenge.save(null,{ useMasterKey: true });
		// 		console.error(
		// 			"Request failed with response code " + httpResponse.status
		// 		);
		// 	}
		// );

		challenge.set("gameId", newGame.id);
		challenge.set("challengeStatus", 2);

		await challenge.save(null, { useMasterKey: true });
	}
});

Moralis.Cloud.define(
	"sendMove",
	async (request) => {
		const { gameId } = request.params;

		const gameQuery = new Moralis.Query("Game");
		const game = await gameQuery.get(gameId);

		const chess = new Chess();
		chess.load_pgn(game.get("pgn"));

		const newMove = chess.move(request.params.move);

		if (!newMove) throw Error("Invalid move");

		game.set("turn", chess.turn());
		game.set("fen", chess.fen());
		game.set("pgn", chess.pgn());
		game.set("lastMove", request.params.move);

		game.save(null, { useMasterKey: true });

		return true;
	},
	validateMove
);

Moralis.Cloud.afterSave("Game", async (request) => {
	const game = request.object;
	if (game.get("pgn")) {
		const chess = new Chess();
		chess.load_pgn(game.get("pgn") || "");
		if (chess.game_over()) {
			game.set("turn", "n");
			game.set("fen", chess.fen());

			let outcome;

			if (chess.in_checkmate()) {
				const loser = chess.turn();
				outcome = loser === "w" ? 4 : 3;
			} else {
				outcome = 2;
			}

			const challengeQuery = new Moralis.Query("Challenge");
			const challenge = await challengeQuery.get(game.get("challengeId"));

			challenge.set("challengeStatus", 3);
			game.set("outcome", outcome);

			game.save(null, { useMasterKey: true });
			challenge.save(null, { useMasterKey: true });
		}
	}
});

Moralis.Cloud.define(
	"claimVictory",
	async (request) => {
		const { gameId, needNFT } = request.params;

		const gameQuery = new Moralis.Query("Game");
		const game = await gameQuery.get(gameId);
		const challengeQuery = new Moralis.Query("Challenge");
		const challenge = await challengeQuery.get(game.get("challengeId"));

		const config = await Moralis.Config.get({ useMasterKey: true });
		const apiKey = config.get("apiKey");

		const body = {
			api: apiKey,
			id: gameId,
			needNFT: needNFT,
			pgn: game.get("pgn"),
			outcome: game.get("outcome"),
			b: game.get("players").b,
			w: game.get("players").w,
		};
		// send http request for end game tx

		const logger = Moralis.Cloud.getLogger();
		const httpResponse = await Moralis.Cloud.httpRequest({
			method: "POST",
			url: "https://shatranj-poc388c1cd6a7ddc783e982f04317f8fe804b7821f-matrix.stackos.io/",
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: body,
		})
			.then(
				async function (httpResponse) {
					logger.info(httpResponse);
				},
				async function (httpResponse) {
					challenge.set("challengeStatus", 10);
					await challenge.save(null, { useMasterKey: true });
				}
			)
			.catch((error) => {
				throw Error(error);
			});
		logger.info(httpResponse);
	},
	validateClaimVictory
);

async function validateMove(request) {
	if (!request.user || !request.user.id) {
		throw Error("Unauthorized");
	}

	const { gameId } = request.params;
	if (!gameId) throw Error("GameId is required");

	const gameQuery = new Moralis.Query("Game");
	const challengeQuery = new Moralis.Query("Challenge");
	const game = await gameQuery.get(gameId);

	const challenge = await challengeQuery.get(game.get("challengeId"));
	const userSide = game.get("sides")[request.user.get("ethAddress")];

	if (!userSide) throw Error("Unauthorized to move");
	if (game.get("turn") !== userSide) throw Error("Not your turn");

	if (challenge.get("challengeStatus") !== 2)
		throw Error("Game is not in progress");

	return true;
}
async function validateClaimVictory(request) {
	if (!request.user || !request.user.id) {
		throw Error("Unauthorized");
	}

	const { gameId } = request.params;
	if (!gameId) throw Error("GameId is required");

	const gameQuery = new Moralis.Query("Game");

	const game = await gameQuery.get(gameId);

	if (game.get("turn") !== "n") throw Error("Game has not finished yet");
	if (game.get("winner") !== request.user.get("ethAddress"))
		throw Error("You are not the winner");

	return true;
}

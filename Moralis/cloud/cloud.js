// Pool and Pairing Functions

// Check if user has a live challenge
Moralis.Cloud.define(
	"joinExistingChallenge",
	async (request) => {
		const existingChallenge = await checkExistingChallenges(
			request.user.get("ethAddress")
		);

		return existingChallenge;
	},
	{
		requireUser: true,
	}
);

// Cancel JOIN Challenge
Moralis.Cloud.define(
	"cancelChallenge",
	async (request) => {
		const Challenge = Moralis.Object.extend("Challenge");
		const challengeQuery = new Moralis.Query(Challenge);
		challengeQuery.equalTo("player1", request.user.get("ethAddress"));
		challengeQuery.equalTo("challengeStatus", 0);
		const challenge = await challengeQuery.first();
		if (!challenge) throw Error("No unpaired challenge to cancel");
		await challenge.destroy();
		return true;
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

		const existingChallenge = await checkExistingChallenges(
			request.user.get("ethAddress")
		);

		if (existingChallenge) {
			return existingChallenge;
		}

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

// Send Move
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

// RESIGN GAME
Moralis.Cloud.define(
	"resign",
	async (request) => {
		const gameId = request.params.gameId;
		const gameQuery = new Moralis.Query("Game");
		const challengeQuery = new Moralis.Query("Challenge");
		const game = await gameQuery.get(gameId);
		const challenge = await challengeQuery.get(game.get("challengeId"));

		const userSide = game.get("players")[request.user.get("ethAddress")];
		game.set("outcome", userSide === "w" ? 4 : 3);
		game.set("turn", "n");

		challenge.set("challengeStatus", 3);

		challenge.save(null, { useMasterKey: true });
		game.save(null, { useMasterKey: true });
	},
	{
		requireUser: true,
		fields: {
			gameId: {
				required: true,
				options: async (gameId) => {
					const gameQuery = new Moralis.Query("Game");
					const game = await gameQuery.get(gameId);
					if (!game.get("players"[request.user.get("ethAddress")]))
						return false;
					return true;
				},
				error: "You are not part of this game",
			},
		},
	}
);

// CLAIM VICTORY
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
		const serverUrl = config.get("serverURL");

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

		const httpResponse = await Moralis.Cloud.httpRequest({
			method: "POST",
			url: `${serverUrl}/end`,
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: body,
		}).catch((error) => {
			throw Error(error);
		});

		if (httpResponse.statusCode === 500) {
			challenge.set("challengeStatus", 10);
			await challenge.save(null, { useMasterKey: true });

			return { txStatus: "unsuccessful" };
		} else if (httpResponse.statusCode === 200 && needNFT) {
			let { ipfs, token_id } = httpResponse.data;
			game.set("nftIpfs", ipfs);
			game.set("nftTokenId", token_id);
			game.set("gameStatus", 5);

			game.save(null, { useMasterKey: true });

			return { txStatus: "successful", ipfs, token_id };
		} else if (httpResponse.statusCode === 200) {
			game.set("gameStatus", 5);
			game.save(null, { useMasterKey: true });

			return { txStatus: "successful" };
		}
		throw Error(
			"Something went wrong. Unknown status code " + httpResponse.statusCode
		);
	},
	validateClaimVictory
);

// After Effects && Triggers

// Trigger oracle after challenge save if challenge has two players
Moralis.Cloud.afterSave("Challenge", async (request) => {
	const challenge = request.object;
	if (challenge.get("challengeStatus") === 1 && !challenge.get("gameId")) {
		const Game = Moralis.Object.extend("Game");
		const newGame = await createNewGame(
			challenge,
			challenge.get("player1"),
			challenge.get("player2")
		);
		await newGame.save(null, { useMasterKey: true });

		const config = await Moralis.Config.get({ useMasterKey: true });
		const apiKey = config.get("apiKey");
		const serverUrl = config.get("serverURL");

		const body = {
			api: apiKey,
			id: newGame.id,
			b: newGame.get("players").b,
			w: newGame.get("players").w,
		};
		// send http request for end game tx
		const httpResponse = await Moralis.Cloud.httpRequest({
			method: "POST",
			url: `${serverUrl}/start`,
			headers: {
				"Content-Type": "application/json;charset=utf-8",
			},
			body: body,
		})
			.then(
				async function (httpResponse) {
					challenge.set("gameId", newGame.id);
					challenge.set("challengeStatus", 2);
					newGame.set("canPlay", true);
					await challenge.save(null, { useMasterKey: true });
					await newGame.save(null, { useMasterKey: true });
				},
				async function (httpResponse) {
					challenge.set("challengeStatus", 9);
					await challenge.save(null, { useMasterKey: true });
				}
			)
			.catch((error) => {
				throw Error(error);
			});
	}
});

// Perform game updates for wins, losses, draws, etc.
Moralis.Cloud.afterSave("Game", async (request) => {
	const game = request.object;
	if (
		game.get("pgn") &&
		game.get("gameStatus") !== 4 &&
		game.get("gameStatus") !== 5 &&
		!game.get("gameStatus")
	) {
		const logger = Moralis.Cloud.getLogger();
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
			game.set(
				"winner",
				outcome === 3
					? game.get("players")["w"]
					: outcome === 4
					? game.get("players")["b"]
					: null
			);

			game.save(null, { useMasterKey: true });
			challenge.save(null, { useMasterKey: true });

			// Change ELOs
			const whitePlayerQuery = new Moralis.Query(Moralis.User);
			const blackPlayerQuery = new Moralis.Query(Moralis.User);

			const white = await whitePlayerQuery
				.equalTo("ethAddress", game.get("players").w)
				.first({ useMasterKey: true });
			const black = await blackPlayerQuery
				.equalTo("ethAddress", game.get("players").b)
				.first({ useMasterKey: true });

			const scoreChange = getScoreChange(
				white.get("ELO"),
				black.get("ELO"),
				outcome
			);

			white.set("ELO", white.get("ELO") + scoreChange);
			black.set("ELO", black.get("ELO") - scoreChange);

			await white.save(null, { useMasterKey: true });
			await black.save(null, { useMasterKey: true });
		}
	}
});

// Update ELO after event received
Moralis.Cloud.afterSave("GameEnd", async (request) => {
	const event = request.object;
	const Game = Moralis.Object.extend("Game");
	const gameQuery = new Moralis.Query("Game");
	const game = await gameQuery.get(event.get("gameId"));

	const { w, b } = game.get("players");

	const userQuery = new Moralis.Query("User");

	const whiteP = await userQuery.get(w);
	const blackP = await userQuery.get(b);

	whiteP.set("ELO", event.get("eloW"));
	blackP.set("ELO", event.get("eloB"));

	await whiteP.save(null, { useMasterKey: true });
	await blackP.save(null, { useMasterKey: true });
});

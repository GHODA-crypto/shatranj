// Pool and Pairing Functions

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
			challenge.set("gameStatus", 1);

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
	if (challenge.get("gameStatus") === 1) {
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
		// 		challenge.set("gameStatus", 10);
		// 		challenge.save(null,{ useMasterKey: true });
		// 		console.error(
		// 			"Request failed with response code " + httpResponse.status
		// 		);
		// 	}
		// );

		challenge.set("gameId", newGame.id);
		challenge.set("gameStatus", 2);

		await challenge.save(null, { useMasterKey: true });
	}
});

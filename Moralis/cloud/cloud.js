// Pool and Pairing Functions

// Join Pairing Pool
Moralis.Cloud.define(
	"quickMatch",
	async (request) => {
		const Challenge = Moralis.Object.extend("Challenge");
		const challengesQuery = new Moralis.Query(Challenge);

		const user = request.user;

		const existingChallenges = await checkExistingChallenges(
			user.get("ethAddress")
		);
		if (existingChallenges.length) {
			return existingChallenges[0];
		}

		let pipeline = [
			{
				match: {
					challenger: {
						$ne: user.get("ethAddress"),
					},
				},
			},
			{
				match: {
					gameStatus: 0,
					challengerELO: {
						$lte: user.get("ELO") + 50,

						$gte: user.get("ELO") - 50,
					},
				},
			},
			{ sort: { createdAt: -1 } },
			{ limit: 2 },
		];

		const challenges = await challengesQuery.aggregate(pipeline);

		if (challenges.length > 0) {
			// Join an existing challenge
			const challengeQuery = new Moralis.Query(Challenge);
			const challenge = await (
				await challengeQuery.get(challenges[0].objectId)
			).fetch();

			const players = challenge.get("players");

			if (players.w)
				challenge.set("players", { ...players, b: user.get("ethAddress") });
			else challenge.set("players", { ...players, w: user.get("ethAddress") });

			challenge.set("gameStatus", 1);

			await challenge.save({ useMasterKey: true });

			// send request to api
			const res = await Moralis.Cloud.httpRequest({
				method: "POST",
				url: "http://shatranj.herokuapp.com/createChallenge",
				headers: {
					"Content-Type": "application/json;charset=utf-8",
				},
				body: {
					challengeId: challenge.get("objectId"),
				},
			}).catch((err) => {
				console.log(err);
			});

			if (res.statusCode === 200) {
				challenge.set("gameStatus", 2);

				await challenge.save({ useMasterKey: true });

				return challenge;
			}

			challenge.set("gameStatus", 4);
			challenge.save({ useMasterKey: true });

			return "Challenge could not be created";
		}

		// Create a new challenge
		const newChallenge = new Challenge();
		const challengerSide = Math.random() < 0.5 ? "w" : "b";

		newChallenge.set("challenger", user.get("ethAddress"));
		newChallenge.set("challengerELO", user.get("ELO"));
		newChallenge.set("players", {
			[challengerSide]: user.get("ethAddress"),
		});
		await newChallenge.save({ useMasterKey: true });
		return newChallenge;
	},
	{
		requireUser: true,
	}
);

// Cancel Game Join
Moralis.Cloud.define(
	"cancelGameJoin",
	(request) => {
		return hello();
	},
	{
		fields: ["movie"],
		requireUser: true,
	}
);

// Game Functions
Moralis.Cloud.define(
	"sendMove",
	(request) => {
		// Verify Signatures

		// Verify Move

		// Save Move

		// Check Game Status

		return hello();
	},
	{
		fields: ["boardState", "move"],
		requireUser: true,
	}
);

Moralis.Cloud.define(
	"getGame",
	(request) => {
		return hello();
	},
	{
		fields: ["gameID"],
		requireUser: true,
	}
);

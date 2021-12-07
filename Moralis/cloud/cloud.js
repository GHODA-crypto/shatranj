// const config = await Moralis.Config.get({ useMasterKey: true });
// const arbitorKey = config.get("arbitorKey");

// Pool and Pairing Functions

// Join Pairing Pool
Moralis.Cloud.define(
	"joinPool",
	async (request) => {
		const Challenge = Moralis.Object.extend("Challenge");
		const user = request.user;

		let pipeline = [
			{
				match: {
					challenger: user.get("ethAddress"),
				},
			},
			{
				match: {
					$or: [{ gameStatus: 0 }, { gameStatus: 1 }, { gameStatus: 2 }],
				},
			},
		];

		const challengesQuery = new Moralis.Query(Challenge);
		const existingChallenges = await challengesQuery.aggregate(pipeline);

		if (existingChallenges.length > 0) {
			return existingChallenges[0];
		}

		pipeline = [
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
			return challenge;
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

// Confirm game Join
Moralis.Cloud.define(
	"confirmGameJoin",
	(request) => {
		return hello();
	},
	{
		fields: ["movie"],
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

function hello() {
	// console.log("Hello World!");
	return "Hello World!";
}

async function checkExistingChallenges(userEthAddress) {
	const Challenge = Moralis.Object.extend("Challenge");
	let pipeline = [
		// {
		// 	match: {
		// 		player1: userEthAddress,
		// 	},
		// },
		// {
		// 	match: {
		// 		player2: userEthAddress,
		// 	},
		// },
		{
			match: {
				gameStatus: { $ne: 3 },
			},
		},
		{
			match: {
				$expr: {
					$or: [
						{ $ne: ["$player1", userEthAddress] },
						{ $ne: ["$player2", userEthAddress] },
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

	newChallenge.set("challengerSide", challengerSide);
	newChallenge.set(
		"lowerElo",
		gamePreferences?.lowerElo || user.get("ELO") - 50
	);
	newChallenge.set(
		"upperElo",
		gamePreferences?.upperElo || user.get("ELO") + 50
	);

	await newChallenge.save({ useMasterKey: true });
	return newChallenge;
}

async function verifyAcceptChallenge(request) {
	if (request.master) {
		return;
	}
	if (!request.user || request.user.id !== "masterUser" || request.user.id) {
		throw "Unauthorized";
	}

	const web3 = Moralis.web3ByChain("0x1");
	const { signature, proxyAddress, challengeId } = request.params;

	if (!signature && !proxyAddress && !challengeId) throw "Invalid Parameters";

	if (
		web3.eth.accounts.recover(
			web3.utils.soliditySha3(
				web3.eth.abi.encodeParameters(
					["uint256", "address"],
					[challengeId, proxyAddress]
				)
			),
			signature
		) === request.user.get("ethAddress")
	) {
		const Challenge = Moralis.Object.extend("Challenge");
		const challengesQuery = new Moralis.Query(Challenge);

		const challenge = await challengesQuery.get(request.params.challengeId);
		if (
			challenge.get("player1") !== request.user.get("ethAddress") ||
			challenge.get("player2") !== request.user.get("ethAddress")
		)
			throw "Unauthorized";

		return true;
	} else throw "Invalid Signature";
}

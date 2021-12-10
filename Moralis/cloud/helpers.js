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
	if (!request.user || !request.user.id) {
		throw Error("Unauthorized");
	}
	const { signature, proxyAddress, challengeIdHex } = request.params;

	const Challenge = Moralis.Object.extend("Challenge");
	const challengesQuery = new Moralis.Query(Challenge);
	const challenge = await challengesQuery.get(hexToId(challengeIdHex));

	if (challenge.get("gameStatus") !== -1 && challenge.get("gameStatus") !== 1)
		throw Error("Challenge is already accepted");

	const web3 = Moralis.web3ByChain("0x1");
	if (!signature && !proxyAddress && !challengeIdHex)
		throw Error("Invalid Parameters");

	const signedData = web3.utils.soliditySha3(
		web3.eth.abi.encodeParameters(
			["uint256", "address"],
			[challengeIdHex, proxyAddress]
		)
	);
	const recoveredAddress = web3.eth.accounts
		.recover(signedData, signature)
		.toLowerCase();

	if (recoveredAddress !== request.user.get("ethAddress"))
		throw Error(`Invalid Signature`);
	return true;
}
function idToHex(string) {
	var number = "0x";
	var length = string.length;
	for (var i = 0; i < length; i++) number += string.charCodeAt(i).toString(16);
	return number;
}
function hexToId(number) {
	var string = "";
	number = number.slice(2);
	var length = number.length;
	for (var i = 0; i < length; ) {
		var code = number.slice(i, (i += 2));
		string += String.fromCharCode(parseInt(code, 16));
	}
	return string;
}

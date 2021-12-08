function hello() {
	console.log("Hello World!");
	return "Hello World!";
}

async function checkExistingChallenges(userEthAddress) {
	let pipeline = [
		{
			match: {
				challenger: userEthAddress,
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
	return existingChallenges;
}

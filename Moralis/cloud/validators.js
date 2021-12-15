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

	if (challenge.get("challengeStatus") !== 2 || !game.get("canPlay"))
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

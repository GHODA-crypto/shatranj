import React, { useEffect, useState } from "react";
import { useMoralisQuery, useMoralisCloudFunction } from "react-moralis";
import Game from "./Game";

const LiveChess = ({ user, isPairing, pairingParams }) => {
	const {
		fetch: fetchGame,
		data: gameData,
		// error: gameError,
		isLoading: isGameLoading,
	} = useMoralisQuery("Game", (query) => query.get(query), [], {
		autoFetch: false,
		live: true,
	});

	const {
		fetch: fetchChallenge,
		data: challenge,
		// error: challengeError,
		// isLoading: isChallengeLoading,
	} = useMoralisCloudFunction(
		"joinPool",
		{ pairingParams },
		{ autoFetch: false }
	);

	useEffect(() => {
		fetchChallenge();
	}, []);

	useEffect(() => {
		const challengeAttributes = challenge.attributes;
		if (challengeAttributes.gameId) {
			fetchGame(challengeAttributes.gameId);
		}
	}, [challenge]);

	return (
		<div className="game">
			<Game user={user} isGameLoading={isGameLoading} gameData={gameData} />
		</div>
	);
};

export default LiveChess;

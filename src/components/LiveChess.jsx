import React, { useMemo, useEffect, useCallback } from "react";
import {
	useMoralisQuery,
	useMoralisCloudFunction,
	useMoralis,
} from "react-moralis";
import Game from "./Game";

const LiveChess = ({ pairingParams, isPairing }) => {
	const { isWeb3Enabled, Moralis, isWeb3EnableLoading, web3, user } =
		useMoralis();

	// Proxy address, Privatekey, Signature
	const proxyAccount = useMemo(async () => {
		// const web3 = await Moralis.enableWeb3();
		// console.log(web3, isWeb3Enabled);

		if (isWeb3Enabled) {
			let proxyAccount;
			if (localStorage.getItem("proxyPrivKey")) {
				const privKey = localStorage.getItem("proxyPrivKey");
				proxyAccount = web3.eth.accounts.privateKeyToAccount(privKey);
			} else {
				proxyAccount = web3.eth.accounts.create();

				localStorage.setItem("proxyPrivKey", proxyAccount.privateKey);
			}

			return {
				address: proxyAccount.address,
				privateKey: proxyAccount.privateKey,
				sign: proxyAccount.sign,
			};
		}
	}, [Moralis, isWeb3Enabled]);

	const signGameAndProxy = useCallback(async () => {
		// const web3 = await Moralis.enableWeb3();

		console.log("Create Signature Now. Proxy Account - ", proxyAccount);
		if (proxyAccount?.address)
			return await web3.eth.sign(
				web3.utils.soliditySha3(
					web3.eth.abi.encodeParameters(
						["uint256", "address"],
						[50, proxyAccount.address]
					)
				),
				user.ethAddress
			);
	}, [Moralis, proxyAccount]);

	const {
		fetch: getChallenge,
		data: challenge,
		// error: challengeError,
		isLoading: isGettingChallenge,
	} = useMoralisCloudFunction(
		"getChallenge",
		{
			gamePreferences: pairingParams,
		},
		{ autoFetch: false }
	);
	const {
		fetch: acceptChallenge,
		data: gameId,
		// error: challengeError,
		isLoading: isAcceptingChallenge,
	} = useMoralisCloudFunction(
		"acceptChallenge",
		{
			challengeId: challenge?.id,
		},
		{ autoFetch: false }
	);

	const {
		fetch: fetchGame,
		data: gameData,
		// error: gameError,
		isLoading: isGameLoading,
	} = useMoralisQuery(
		"Game",
		(query) => gameId && query.get(gameId),
		[gameId],
		{
			autoFetch: false,
			// live: true,
		}
	);

	useEffect(() => {
		(async () => {
			const challenge = await getChallenge();
			console.log(challenge);
			const signature = await signGameAndProxy();
			if (signature) {
				await acceptChallenge({
					challengeId: challenge?.id,
					signature,
					proxyAddress: proxyAccount?.address,
				});
				await fetchGame();
			}
		})();
	}, [isPairing]);

	return (
		<div className="game">
			<Game user={user} />
			{/* <Game user={user} isGameLoading={isGameLoading} gameData={gameData} /> */}
		</div>
	);
};

export default LiveChess;

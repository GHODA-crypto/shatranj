import React, { useEffect } from "react";
import { useWeb3ExecuteFunction, useMoralis, useChain } from "react-moralis";
import { notification } from "antd";
import { gameAbi, ERC20Abi } from "../contracts/abi";

const Stakes = () => {
	const { user, Moralis } = useMoralis();
	const { chain } = useChain();
	const chessGameAddress = "0xf130F47B6165A15dea881707E3aF662a5f25B941";
	const chessERC20Address = "0xcF80141dA5BbFcD224a1817a2b0c3Cb04f55f91A";

	const openErrorNotification = () => {
		notification["error"]({
			message: "User on Wrong Chain",
			description:
				"Please change the chain/network to Polygon Mumbai Testnet using the button left of the top right corner of the page",
			placement: "bottomRight",
		});
	};

	// Erc20 => allowance => owner->user => spender->chessGame
	// approve amount max
	// stake and unstake -> Game

	const {
		data: gameData,
		error: gameError,
		fetch: gameFetch,
		isFetching: isGameFetching,
	} = useWeb3ExecuteFunction({
		abi: gameAbi,
		contractAddress: chessGameAddress,
		functionName: "getStakedBalance",
		params: {
			_player: user?.attributes?.ethAddress,
		},
	});

	const { data, error, fetch, isFetching } = useWeb3ExecuteFunction();

	const {
		data: erc20Data,
		error: erc20Error,
		fetch: erc20Fetch,
		isFetching: isErc20Fetching,
	} = useWeb3ExecuteFunction({
		abi: ERC20Abi,
		contractAddress: chessERC20Address,
		functionName: "balanceOf",
		params: {
			account: user?.attributes?.ethAddress,
		},
	});

	return (
		<div style={{ marginTop: "3rem" }}>
			{gameError && <h1>{gameError.message}</h1>}
			<button
				onClick={() => {
					if (chain?.chainId !== "0x13881") {
						openErrorNotification();
						return;
					}
					gameFetch();
				}}
				disabled={isGameFetching}>
				Fetch data
			</button>
			{gameData && <pre>{JSON.stringify(gameData)}</pre>}
			<button
				onClick={() => {
					if (chain?.chainId !== "0x13881") {
						openErrorNotification();
						return;
					}
					erc20Fetch();
				}}
				disabled={isErc20Fetching}>
				Fetch Tokens
			</button>
			{erc20Error && <h1>{erc20Error.message}</h1>}
			{console.log(erc20Data)}
			{erc20Data && <pre>{Moralis.Units.FromWei(Number(erc20Data))}</pre>}
		</div>
	);
};

export default Stakes;

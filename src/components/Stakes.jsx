import React, { useEffect } from "react";
import { useWeb3ExecuteFunction, useMoralis, useChain } from "react-moralis";
import { notification } from "antd";
import { abi } from "../contracts/chessGameAbi";

const Stakes = () => {
	const { user } = useMoralis();
	const { chain } = useChain();
	const chessGameAddress = "0xf130F47B6165A15dea881707E3aF662a5f25B941";

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

	const options = {
		abi: abi,
		contractAddress: chessGameAddress,
		functionName: "getStakedBalance",
		params: {
			_player: user?.attributes?.ethAddress,
		},
	};

	const { data, error, fetch, isFetching, isLoading } =
		useWeb3ExecuteFunction(options);

	return (
		<div style={{ marginTop: "3rem" }}>
			{error && <h1>{error.message}</h1>}
			<button
				onClick={() => {
					if (chain.chainId !== "0x13881") {
						openErrorNotification();
						return;
					}
					fetch();
				}}
				disabled={isFetching}>
				Fetch data
			</button>
			{data && <pre>{JSON.stringify(data)}</pre>}
		</div>
	);
};

export default Stakes;

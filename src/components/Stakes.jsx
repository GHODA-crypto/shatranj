import React, { useEffect, useState } from "react";
import { useWeb3ExecuteFunction, useMoralis, useChain } from "react-moralis";
import { notification } from "antd";
import { gameAbi, ERC20Abi } from "../contracts/abi";

import "../styles/stakes.scss";

const Stakes = () => {
	const [stakeAmount, setStakeAmount] = useState(0);
	const [unstakeAmount, setUnstakeAmount] = useState(0);
	const { user, Moralis, isWeb3Enabled, isWeb3EnableLoading } = useMoralis();
	const chessGameAddress = "0xf130F47B6165A15dea881707E3aF662a5f25B941";
	const chessERC20Address = "0xcF80141dA5BbFcD224a1817a2b0c3Cb04f55f91A";

	const {
		data: stakeBalData,
		error: stakeBalError,
		fetch: stakeBalFetch,
		isFetching: isStakeBalFetching,
	} = useWeb3ExecuteFunction({
		abi: gameAbi,
		contractAddress: chessGameAddress,
		functionName: "getStakedBalance",
		params: {
			_player: user?.attributes?.ethAddress,
		},
	});

	const {
		data: approveData,
		error: approveError,
		fetch: approveFetch,
		isFetching: isApproveFetching,
	} = useWeb3ExecuteFunction({
		abi: ERC20Abi,
		contractAddress: chessERC20Address,
		functionName: "approve",
		params: {
			spender: chessGameAddress,
			amount: 10 ** 30,
		},
	});

	const {
		data: allowData,
		error: allowError,
		fetch: allowFetch,
		isFetching: isAllowFetching,
	} = useWeb3ExecuteFunction({
		abi: ERC20Abi,
		contractAddress: chessERC20Address,
		functionName: "allowance",
		params: {
			owner: user?.attributes?.ethAddress,
			spender: chessGameAddress,
		},
	});

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

	const {
		data: stakeData,
		error: stakeError,
		fetch: stakeFetch,
		isFetching: isStakeFetching,
	} = useWeb3ExecuteFunction({
		abi: gameAbi,
		contractAddress: chessGameAddress,
		functionName: "stake",
		params: {
			_player: user?.attributes?.ethAddress,
		},
	});

	const {
		data: unstakeData,
		error: unstakeError,
		fetch: unstakeFetch,
		isFetching: isUnstakeFetching,
	} = useWeb3ExecuteFunction({
		abi: gameAbi,
		contractAddress: chessGameAddress,
		functionName: "getStakedBalance",
		params: {
			_amount: stakeAmount,
		},
	});

	const initaliser = () => {
		stakeBalFetch();
		erc20Fetch();
		approveFetch();
		console.log("approve ->", approveData);
		console.log("approve error:", approveError);
		console.log("erc20 error:", erc20Error);
		console.log("stakeBal error:", stakeBalError);
	};

	useEffect(() => {
		initaliser();
		if (!isWeb3Enabled && !isWeb3EnableLoading) Moralis.enableWeb3();
	}, [isWeb3Enabled]);

	return (
		<div className="Stakes" style={{ marginTop: "3rem" }}>
			<section className="amounts">
				<div className="erc20-balance balance">
					<span className="label">GHD Balance</span>
					<span className="amount">
						{Moralis.Units.FromWei(Number(erc20Data))}
					</span>
				</div>
				<div className="staked-balance balance">
					<span className="label">Staked GHD</span>
					<span className="amount">{Number(stakeBalData)}</span>
				</div>
			</section>
			<section className="stake-unstake">
				<div className="stake card">
					<div className="title">Stake GHD</div>
					<div className="stake-input input">
						<span className="token">GHD</span>
						<input
							type="number"
							className="stake-amount amount"
							value={stakeAmount}
							onWheel={(e) => e.target.blur()}
							onChange={(e) => setStakeAmount(e.target.value)}
						/>
						<button
							className="max"
							onClick={() =>
								setStakeAmount(Moralis.Units.FromWei(Number(erc20Data)))
							}>
							max
						</button>
					</div>
					<div className="stake-submit submit">
						{approveData === false || stakeAmount > allowData ? (
							<button
								className="stake-btn"
								onClick={() => {
									stakeFetch();
									console.log("stake error: ", stakeError);
								}}>
								Stake
							</button>
						) : (
							<button
								className="approve-btn"
								onClick={() => {
									approveFetch();
									console.log("approve error:", approveError);
								}}>
								Approve
							</button>
						)}
					</div>
				</div>
				<div
					className="unstake card"
					style={Number(stakeBalData) === 0 ? { opacity: "30%" } : null}>
					<div className="title">Unstake GHD</div>
					<div className="unstake-input input">
						<span className="token">GHD</span>

						<input
							type="number"
							className="unstake-amount amount"
							value={unstakeAmount}
							onWheel={(e) => e.target.blur()}
							onChange={(e) => setUnstakeAmount(e.target.value)}
							disabled={Number(stakeBalData) === 0}
						/>
						<button
							className="max"
							onClick={() => setUnstakeAmount(Number(stakeBalData))}
							disabled={Number(stakeBalData) === 0}
							style={Number(stakeBalData) === 0 ? { cursor: "default" } : null}>
							max
						</button>
					</div>
					<div className="unstake-submit submit">
						{approveData === false ? (
							<button
								className="unstake-btn"
								onClick={() => {
									unstakeFetch();
									console.log("stake error: ", unstakeError);
								}}
								style={
									Number(stakeBalData) === 0 ? { cursor: "default" } : null
								}
								disabled={Number(stakeBalData) === 0}>
								Unstake
							</button>
						) : (
							<button className="approve-btn" onClick={approveFetch}>
								Approve
							</button>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Stakes;

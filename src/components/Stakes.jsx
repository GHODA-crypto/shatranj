import React, { useEffect, useState } from "react";
import { useWeb3ExecuteFunction, useMoralis, useChain } from "react-moralis";
import { Modal } from "antd";
import { gameAbi, ERC20Abi } from "../contracts/abi";

import { ReactComponent as Loader } from "../assets/loader.svg";

import "../styles/stakes.scss";

const Stakes = () => {
	const [stakeAmount, setStakeAmount] = useState(0);
	const [unstakeAmount, setUnstakeAmount] = useState(0);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { user, Moralis, isWeb3Enabled, isWeb3EnableLoading } = useMoralis();
	const chessGameAddress = "0xa07879CB8E2A7c63a0D94e6969528539bf2E4433";
	const chessERC20Address = "0x3bd4045D5eDC18dCdE77CAde9602C3756113A41B";

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
			amount: Moralis.Units.Token("1000000000", "18"),
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
			_amount: Number(stakeAmount),
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
		functionName: "unstake",
		params: {
			_amount: Number(unstakeAmount),
		},
	});

	const initaliser = () => {
		stakeBalFetch();
		erc20Fetch();
		// approveFetch();
		allowFetch();
		console.log("approve ->", approveData);
		console.log("allow ->", allowData);
		console.log("allow error:", allowError);
		console.log("erc20 error:", erc20Data);
		console.log("stakeBal error:", stakeBalData);
	};

	useEffect(() => {
		initaliser();
		if (!isWeb3Enabled) Moralis.enableWeb3();
	}, [isWeb3Enabled, erc20Data, stakeBalData]);

	return (
		<div className="Stakes" style={{ marginTop: "3rem" }}>
			<Modal
				title="Loading"
				visible={isStakeFetching}
				footer={null}
				closable={false}>
				<p>Staking in progrss...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isAllowFetching}
				footer={null}
				closable={false}>
				<p>Allowance Check in progrss...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isApproveFetching}
				footer={null}
				closable={false}>
				<p>Approving in progrss...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isStakeBalFetching}
				footer={null}
				closable={false}>
				<p>Staked GHODA Check in progrss...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isErc20Fetching}
				footer={null}
				closable={false}>
				<p>GHODA Balance Check in progrss...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isUnstakeFetching}
				footer={null}
				closable={false}>
				<p>Unstaking in progrss...</p>
			</Modal>
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
							disabled={!approveData || !approveData?.status}
							onWheel={(e) => e.target.blur()}
							onChange={(e) => setStakeAmount(e.target.value)}
						/>
						<button
							className="max"
							onClick={() =>
								setStakeAmount(Moralis.Units.FromWei(Number(erc20Data)))
							}
							disabled={!approveData?.status}>
							max
						</button>
					</div>
					<div className="stake-submit submit">
						{approveData?.status && stakeAmount < Number(allowData) ? (
							<button
								className="stake-btn"
								onClick={async () => {
									await stakeFetch();
									await erc20Fetch();
									await stakeBalFetch();
									console.log("stake error: ", stakeError);
									console.log("stakeBal error: ", stakeBalError);
									console.log("erc20 error: ", erc20Error);
									setStakeAmount(0);
								}}>
								Stake
							</button>
						) : (
							<button
								className="approve-btn"
								onClick={async () => {
									await approveFetch();
									await allowFetch();
									console.log("approve error:", approveError);
									console.log("allow error:", allowError);
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
							disabled={
								!approveData ||
								!approveData?.status ||
								Number(stakeBalData) === 0
							}
							onWheel={(e) => e.target.blur()}
							onChange={(e) => setUnstakeAmount(e.target.value)}
						/>
						<button
							className="max"
							onClick={() => setUnstakeAmount(Number(stakeBalData))}
							disabled={Number(stakeBalData) === 0 || !approveData?.status}
							style={Number(stakeBalData) === 0 ? { cursor: "default" } : null}>
							max
						</button>
					</div>
					<div className="unstake-submit submit">
						{approveData?.status ? (
							<button
								className="unstake-btn"
								onClick={async () => {
									await unstakeFetch();
									await erc20Fetch();
									await stakeBalFetch();
									console.log("stake error: ", unstakeError);
									console.log("stakeBal error: ", stakeBalError);
									console.log("erc20 error: ", erc20Error);
									setUnstakeAmount(0);
								}}
								style={
									Number(stakeBalData) === 0 ? { cursor: "default" } : null
								}
								disabled={Number(stakeBalData) === 0}>
								Unstake
							</button>
						) : (
							<button
								className="approve-btn"
								onClick={async () => {
									await approveFetch();
									await allowFetch();
									console.log("approve error:", approveError);
									console.log("allow error:", allowError);
								}}>
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

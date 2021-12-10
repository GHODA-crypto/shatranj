import React, { useEffect, useState } from "react";
import {
	useWeb3ExecuteFunction,
	useMoralis,
	useMoralisQuery,
} from "react-moralis";
import { Modal } from "antd";
import { gameAbi, ERC20Abi } from "../contracts/abi";
import { notification } from "antd";

import { ReactComponent as Loader } from "../assets/loader.svg";

import "../styles/stakes.scss";

const SGHODA_TOKEN_ADDRESS = "0xd8e785d3423799d24260c3b3d9b5b3961cd3875a";
const GHODA_TOKEN_ADDRESS = "0xc86bb11da8566f2cb4f9e53b6b9091d2ec17446b";

const Stakes = () => {
	const [stakeAmount, setStakeAmount] = useState(0);
	const [unstakeAmount, setUnstakeAmount] = useState(0);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { user, Moralis, isWeb3Enabled, isWeb3EnableLoading } = useMoralis();

	const openNoStakeErrorNotification = () => {
		notification["error"]({
			message: "No Tokens Staked",
			description:
				"You have not staked any tokens. Please stake some tokens to unstake tokens.",
			placement: "bottomRight",
		});
	};

	const {
		data: [stakedBalanceObj],
		error: stakedBalanceObjError,
		isLoading: isStakedBalanceLoading,
	} = useMoralisQuery(
		"PolygonTokenBalance",
		(query) =>
			query
				.equalTo("address", user?.get("ethAddress"))
				.equalTo("token_address", SGHODA_TOKEN_ADDRESS),
		[user],
		{
			live: true,
		}
	);

	const {
		data: [tokenBalanceObj],
		error: tokenBalanceObjError,
		isLoading: isTokenBalanceLoading,
	} = useMoralisQuery(
		"PolygonTokenBalance",
		(query) =>
			query
				.equalTo("address", user?.get("ethAddress"))
				.equalTo("token_address", GHODA_TOKEN_ADDRESS),
		[user],
		{
			live: true,
		}
	);

	const [tokenBalance, setTokenBalance] = useState(0);
	const [stakedBalance, setStakedBalance] = useState(0);

	useEffect(() => {
		setTokenBalance(
			Moralis.Units.FromWei(tokenBalanceObj?.get("balance") || 0)
		);
		setStakedBalance(
			Moralis.Units.FromWei(stakedBalanceObj?.get("balance") || 0)
		);
	}, [stakedBalanceObj, tokenBalanceObj]);

	const {
		data: approvalData,
		error: getApprovalError,
		fetch: getApproval,
		isFetching: isApproveFetching,
	} = useWeb3ExecuteFunction({
		abi: ERC20Abi,
		contractAddress: GHODA_TOKEN_ADDRESS,
		functionName: "approve",
		params: {
			spender: SGHODA_TOKEN_ADDRESS,
			amount: Moralis.Units.Token("1000000000", "18"),
		},
	});

	const {
		data: allowanceData,
		error: allowanceError,
		fetch: getAllowance,
		isFetching: isAllowanceFetching,
	} = useWeb3ExecuteFunction({
		abi: ERC20Abi,
		contractAddress: GHODA_TOKEN_ADDRESS,
		functionName: "allowance",
		params: {
			owner: user?.attributes?.ethAddress,
			spender: SGHODA_TOKEN_ADDRESS,
		},
	});

	const {
		error: stakeError,
		fetch: stakeTokens,
		isFetching: isStakingTokens,
	} = useWeb3ExecuteFunction({
		abi: gameAbi,
		contractAddress: SGHODA_TOKEN_ADDRESS,
		functionName: "stake",
		params: {
			_amount: Moralis.Units.Token(Number(stakeAmount), "18"),
		},
	});

	const {
		error: unstakeTokenError,
		fetch: unstakeTokens,
		isFetching: isUnstakingTokens,
	} = useWeb3ExecuteFunction({
		abi: gameAbi,
		contractAddress: SGHODA_TOKEN_ADDRESS,
		functionName: "unstake",
		params: {
			_amount: Moralis.Units.Token(Number(unstakeAmount), "18"),
		},
	});

	useEffect(() => {
		if (isWeb3Enabled) getAllowance();
	}, [isWeb3Enabled]);
	useEffect(() => {
		console.log(approvalData);
	}, [approvalData]);

	return (
		<div className="Stakes" style={{ marginTop: "3rem" }}>
			<Modal
				title="Loading"
				visible={isStakingTokens}
				footer={null}
				closable={false}>
				<p>Staking in progress...</p>
			</Modal>
			{/* <Modal
				title="Loading"
				visible={isAllowanceFetching}
				footer={null}
				closable={false}>
				<p>Allowance Check in progress...</p>
			</Modal> */}
			<Modal
				title="Loading"
				visible={isApproveFetching}
				footer={null}
				closable={false}>
				<p>Approving in progress...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isStakedBalanceLoading}
				footer={null}
				closable={false}>
				<p>Staked GHODA Check in progress...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isTokenBalanceLoading}
				footer={null}
				closable={false}>
				<p>GHODA Balance Check in progress...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isUnstakingTokens}
				footer={null}
				closable={false}>
				<p>Unstaking in progress...</p>
			</Modal>
			<section className="amounts">
				<div className="erc20-balance balance">
					<span className="label">GHODA</span>
					<span className="amount">{tokenBalance}</span>
				</div>
				<div className="staked-balance balance">
					<span className="label">sGHODA</span>
					<span className="amount">{stakedBalance}</span>
				</div>
			</section>

			<section className="stake-unstake">
				<div className="stake card">
					<div className="title">Stake GHODA</div>
					<div className="stake-input input">
						<span className="token">GHODA</span>
						<input
							type="number"
							className="stake-amount amount"
							value={stakeAmount}
							onWheel={(e) => e.target.blur()}
							onChange={(e) => setStakeAmount(e.target.value)}
						/>
						<button
							className="max"
							onClick={() => setStakeAmount(tokenBalance)}>
							max
						</button>
					</div>
					<div className="stake-submit submit">
						{approvalData?.status && stakeAmount < Number(allowanceData) ? (
							<button
								className="stake-btn"
								onClick={async () => {
									!approvalData?.status && (await getApproval());
									await stakeTokens();
									setStakeAmount(0);
								}}>
								Stake
							</button>
						) : (
							<button
								className="approve-btn"
								onClick={async () => {
									await getApproval();
									await getAllowance();
									console.log("approve error:", getApproval);
									console.log("allow error:", allowanceError);
								}}>
								Approve
							</button>
						)}
					</div>
				</div>
				<div className="unstake card">
					<div className="title">Unstake sGHODA</div>
					<div className="unstake-input input">
						<span className="token">sGHODA</span>

						<input
							type="number"
							className="unstake-amount amount"
							value={unstakeAmount}
							disabled={
								!approvalData ||
								!approvalData?.status ||
								Number(stakedBalanceObj) === 0
							}
							onWheel={(e) => e.target.blur()}
							onChange={(e) => setUnstakeAmount(e.target.value)}
						/>
						<button
							className="max"
							onClick={() => {
								setUnstakeAmount(stakedBalance);
							}}>
							max
						</button>
					</div>
					<div className="unstake-submit submit">
						<button
							className="unstake-btn"
							onClick={async () => {
								if (Number(stakedBalance) === 0) {
									openNoStakeErrorNotification();
									return;
								}
								await unstakeTokens();
								setUnstakeAmount(0);
							}}>
							Unstake
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Stakes;

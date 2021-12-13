import React, { useEffect, useState, useMemo } from "react";
import { Modal, notification, Tooltip } from "antd";
import {
	useWeb3ExecuteFunction,
	useMoralis,
	useMoralisQuery,
} from "react-moralis";

import { gameAbi, ERC20Abi } from "../contracts/abi";
import { useWindowSize } from "../hooks/useWindowSize";
import { numDisplayFormatter } from "../helpers/numDisplayFormatter";
import {
	SGHODA_TOKEN_ADDRESS,
	GHODA_TOKEN_ADDRESS,
} from "../contracts/address";

import "../styles/stakes.scss";

const Stakes = () => {
	const [stakeAmount, setStakeAmount] = useState(0);
	const [unstakeAmountInput, setUnstakeAmountInput] = useState(0);

	const { user, Moralis, isWeb3Enabled } = useMoralis();
	const winSize = useWindowSize();

	const {
		data: tokenBalance,
		error: tokenBalanceError,
		fetch: fetchTokenBalance,
		isFetching: isTokenBalanceLoading,
	} = useWeb3ExecuteFunction({
		abi: ERC20Abi,
		contractAddress: GHODA_TOKEN_ADDRESS,
		functionName: "balanceOf",
		params: {
			account: user?.get("ethAddress"),
		},
	});

	const {
		data: stakedBalance,
		error: stakedBalanceError,
		fetch: fetchStakedBalance,
		isFetching: isStakedBalanceLoading,
	} = useWeb3ExecuteFunction({
		abi: ERC20Abi,
		contractAddress: SGHODA_TOKEN_ADDRESS,
		functionName: "balanceOf",
		params: {
			account: user?.get("ethAddress"),
		},
	});

	const {
		data: approvalData,
		error: getApprovalFromUserError,
		fetch: getApprovalFromUser,
		isFetching: isApproving,
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
		fetch: getAllowanceForUser,
		isFetching: isAllowanceFetching,
	} = useWeb3ExecuteFunction({
		abi: ERC20Abi,
		contractAddress: GHODA_TOKEN_ADDRESS,
		functionName: "allowance",
		params: {
			owner: user?.get("ethAddress"),
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
			_amount: Moralis.Units.Token(stakeAmount, "18"),
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
			_amount: Moralis.Units.Token(unstakeAmountInput, "18"),
		},
	});

	const allowedAmountToSpend = useMemo(
		() => Moralis.Units.FromWei(allowanceData || 0),
		[allowanceData]
	);

	useEffect(() => {
		isWeb3Enabled && user && getAllowanceForUser();
	}, [isWeb3Enabled, user]);

	useEffect(() => {
		fetchTokenBalance();
		fetchStakedBalance();
	}, []);

	return (
		<div className="Stakes" style={{ marginTop: "3rem" }}>
			<Modals
				isStakingTokens={isStakingTokens}
				isApproving={isApproving}
				isStakedBalanceLoading={isStakedBalanceLoading}
				isTokenBalanceLoading={isTokenBalanceLoading}
				isUnstakingTokens={isUnstakingTokens}
			/>

			<section className="amounts">
				<div className="erc20-balance balance">
					<Tooltip
						title="$GHODA in your wallet"
						placement={winSize.width > 1024 ? "left" : "bottom"}
						overlayClass="tooltip"
						arrowPointAtCenter={true}>
						<span className="label" style={{ cursor: "help" }}>
							GHODA
						</span>
					</Tooltip>
					<span className="amount">
						{numDisplayFormatter(Moralis.Units.FromWei(tokenBalance))}
					</span>
				</div>
				<div className="staked-balance balance">
					<Tooltip
						title="Staked $GHODA. Required to play the game"
						placement={winSize.width > 1024 ? "right" : "bottom"}
						overlayClass="tooltip"
						arrowPointAtCenter={true}>
						<span className="label" style={{ cursor: "help" }}>
							sGHODA
						</span>
					</Tooltip>
					<span className="amount">
						{numDisplayFormatter(Moralis.Units.FromWei(stakedBalance))}
					</span>
				</div>
			</section>
			<section className="stake-unstake">
				<div className="stake card">
					<div className="title">Stake</div>
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
							onClick={() =>
								setStakeAmount(Moralis.Units.FromWei(tokenBalance))
							}>
							max
						</button>
					</div>
					<div className="stake-submit submit">
						{allowedAmountToSpend >= stakeAmount ? (
							<button
								className="stake-btn"
								disabled={!stakeAmount}
								onClick={async () => {
									await stakeTokens();
									await fetchStakedBalance();
									await fetchTokenBalance();
									setStakeAmount(0);
								}}>
								Stake
							</button>
						) : (
							<button
								className="approve-btn"
								onClick={async () => {
									await getApprovalFromUser();
								}}>
								Approve
							</button>
						)}
					</div>
				</div>
				<div className="unstake card">
					<div className="title">Unstake</div>
					<div className="unstake-input input">
						<span className="token">GHODA</span>

						<input
							type="number"
							className="unstake-amount amount"
							value={unstakeAmountInput}
							onWheel={(e) => e.target.blur()}
							onChange={(e) => setUnstakeAmountInput(e.target.value)}
						/>
						<button
							className="max"
							onClick={() => {
								setUnstakeAmountInput(Moralis.Units.FromWei(stakedBalance));
							}}>
							max
						</button>
					</div>
					<div className="unstake-submit submit">
						<button
							className="unstake-btn"
							disabled={
								unstakeAmountInput < 0 || !unstakeAmountInput || !isWeb3Enabled
							}
							onClick={async () => {
								if (stakedBalance === 0) {
									openNoStakeErrorNotification();
									setUnstakeAmountInput(0);
									return;
								}
								await unstakeTokens();
								await fetchStakedBalance();
								await fetchTokenBalance();
								setUnstakeAmountInput(0);
							}}>
							Unstake
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

const Modals = ({
	isStakingTokens,
	isApproving,
	isStakedBalanceLoading,
	isTokenBalanceLoading,
	isUnstakingTokens,
}) => {
	return (
		<>
			<Modal
				title="Loading"
				visible={isStakingTokens}
				footer={null}
				closable={false}>
				<p>Staking in progress...</p>
			</Modal>
			<Modal
				title="Loading"
				visible={isApproving}
				footer={null}
				closable={false}>
				<p>Approval in progress...</p>
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
		</>
	);
};
const openNoStakeErrorNotification = () => {
	notification["error"]({
		message: "No Tokens Staked",
		description:
			"You have not staked any tokens. Please stake some tokens to unstake tokens.",
		placement: "bottomRight",
	});
};
export default Stakes;

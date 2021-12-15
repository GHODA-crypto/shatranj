import { useState, useEffect } from "react";
import { notification, Modal } from "antd";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

import GameOptionsModal from "./GameOptionsModal";
import { erc20Abi } from "../../contracts/erc20Abi";
import {
	SGHODA_TOKEN_ADDRESS,
	GHODA_TOKEN_ADDRESS,
} from "../../contracts/address";

import "../../styles/lobby.scss";

const Lobby = ({ setIsPairing, pairingParams, setPairingParams }) => {
	const { Moralis, isWeb3Enabled, user } = useMoralis();
	const [isModalVisible, setIsModalVisible] = useState(false);

	const {
		data: allowanceData,
		error: allowanceError,
		fetch: getAllowanceForUser,
		isFetching: isAllowanceFetching,
	} = useWeb3ExecuteFunction({
		abi: erc20Abi,
		contractAddress: GHODA_TOKEN_ADDRESS,
		functionName: "allowance",
		params: {
			owner: user?.get("ethAddress"),
			spender: SGHODA_TOKEN_ADDRESS,
		},
	});

	const {
		data: stakedBalance,
		error: stakedBalanceError,
		fetch: fetchStakedBalance,
		isFetching: isStakedBalanceLoading,
	} = useWeb3ExecuteFunction({
		abi: erc20Abi,
		contractAddress: SGHODA_TOKEN_ADDRESS,
		functionName: "balanceOf",
		params: {
			account: user?.get("ethAddress"),
		},
	});

	const handlePlayWithFriend = () => {
		if (Moralis.Units.FromWei(stakedBalance) < 10) {
			openStakeErrorNotification();
			return;
		}
		!user ? openErrorNotification() : showModal();
	};

	const handleCreateGame = () => {
		if (Moralis.Units.FromWei(stakedBalance) < 10) {
			openStakeErrorNotification();
			return;
		}
		!user ? openErrorNotification() : showModal();
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const quickMatch = (e) => {
		if (Moralis.Units.FromWei(stakedBalance) < 10) {
			openStakeErrorNotification();
			return;
		}
		if (!user) {
			openErrorNotification();
			return;
		}
		setIsPairing(true);
	};

	useEffect(() => {
		isWeb3Enabled && user && getAllowanceForUser();
	}, [getAllowanceForUser, isWeb3Enabled, user]);

	useEffect(() => {
		fetchStakedBalance();
	}, [isWeb3Enabled, user]);

	return (
		<div className="lobby">
			<Modal
				title="Initialising Game"
				visible={isStakedBalanceLoading}
				footer={null}
				closable={false}>
				<p>🏇 Preparing the Stallians for war 🏇</p>
			</Modal>

			<GameOptionsModal
				isModalVisible={isModalVisible}
				setIsModalVisible={setIsModalVisible}
				pairingParams={pairingParams}
				setPairingParams={setPairingParams}
				setIsPairing={setIsPairing}
			/>

			<section className="play">
				<button className="join-game-btn" onClick={quickMatch}>
					🚀
					<span className="btn-text">Quick Match</span>
				</button>
				<button className="create-game-btn" onClick={handleCreateGame}>
					🛠️
					<span className="btn-text">Create Game</span>
				</button>
				<button className="play-with-friend-btn" onClick={handlePlayWithFriend}>
					🤝
					<span className="btn-text">Play with friend</span>
				</button>
			</section>

			<div className="separator"></div>

			<section className="prev-games"></section>
		</div>
	);
};

const openErrorNotification = () => {
	notification["error"]({
		message: "User not Authenticated",
		description:
			"Please connect your wallet to create a game. You can connect your wallet by clicking on the authenticate button in the top right corner.",
		placement: "bottomRight",
	});
};

const openStakeErrorNotification = () => {
	notification["error"]({
		message: "Not Enough GHODA Staked",
		description:
			"You have not staked enough $GHODA to play. Please stake more $GHODA in the staked tab to play.",
		placement: "bottomRight",
	});
};

export default Lobby;

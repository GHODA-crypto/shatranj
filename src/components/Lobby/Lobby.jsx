import { useState, useEffect } from "react";
import { notification, Modal } from "antd";
import {
	useMoralis,
	useWeb3ExecuteFunction,
	useMoralisCloudFunction,
} from "react-moralis";
import useSound from "use-sound";

import { CheckCircleOutlined } from "@ant-design/icons";
import GameOptionsModal from "./GameOptionsModal";
import { erc20Abi } from "../../contracts/erc20Abi";
import {
	SGHODA_TOKEN_ADDRESS,
	GHODA_TOKEN_ADDRESS,
} from "../../contracts/address";

import "../../styles/lobby.scss";
import Confirmation from "../../assets/chess_audio/Confirmation.mp3";
import SocialNotify from "../../assets/chess_audio/SocialNotify.mp3";

const Lobby = ({ setIsPairing, pairingParams, setPairingParams }) => {
	const [playConfirmation] = useSound(Confirmation);
	const [playSocialNotify] = useSound(SocialNotify);
	const { Moralis, isWeb3Enabled, user } = useMoralis();
	const [isModalVisible, setIsModalVisible] = useState(false);

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
	const { fetch: joinLiveChess } = useMoralisCloudFunction(
		"joinLiveChess",
		{ pairingParams },
		{ autoFetch: false }
	);

	useEffect(() => {
		console.log(stakedBalance, stakedBalanceError);
	}, [stakedBalance]);

	useEffect(() => {
		fetchStakedBalance();
	}, [fetchStakedBalance, isWeb3Enabled, user]);

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
		playSocialNotify();
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
		joinLiveChess({ pairingParams });
		setIsPairing(true);
	};

	const { confirm } = Modal;

	function showGameConfirm() {
		confirm({
			title: "Are you sure you want to start a game?",
			icon: <CheckCircleOutlined />,
			content: "By starting the game you bet 10 GHODA in the pool.",
			okText: "Start Game",
			okType: "primary",
			cancelText: "Close",
			onOk() {
				quickMatch();
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	}

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
				joinLiveChess={joinLiveChess}
			/>

			<section className="play">
				<button
					className="join-game-btn"
					onClick={() => {
						showGameConfirm();
						playConfirmation();
					}}>
					🚀
					<span className="btn-text">Quick Match</span>
				</button>
				<button className="create-game-btn" onClick={handleCreateGame}>
					🛠️
					<span className="btn-text">Create Game</span>
				</button>
				<button
					disabled
					className="play-with-friend-btn"
					onClick={handlePlayWithFriend}>
					🤝
					<span className="btn-text">Play with friend</span>
				</button>
			</section>
			<section className="knight-art"></section>
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

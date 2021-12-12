import { useState, useMemo, useEffect } from "react";
import ShowBoard from "../ChessBoards/Show";
import { notification, Modal } from "antd";
import "../../styles/lobby.scss";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import GameOptionsModal from "./GameOptionsModal";
import { ERC20Abi } from "../../contracts/abi";

const SGHODA_TOKEN_ADDRESS =
	"0xa57260c7C943f67BCe9AEc958a5AA29Ccd8372e0".toLowerCase();
const GHODA_TOKEN_ADDRESS =
	"0x3706da1458877be03E55caC757938B4130e80EB9".toLowerCase();

const Lobby = ({ setIsPairing }) => {
	const { Moralis, isWeb3Enabled, user } = useMoralis();

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

	// const stakedTokenBalance = useMemo(
	// 	() => Moralis.Units.FromWei(stakedBalance),
	// 	[stakedBalance]
	// );

	const [gameOptions, setGameOptions] = useState({
		color: "w",
		rangeUpper: 100,
		rangeLower: 100,
	});
	const [isModalVisible, setIsModalVisible] = useState(false);

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
	}, [isWeb3Enabled, user]);

	useEffect(() => {
		fetchStakedBalance();
		// console.log("stakedBalance", stakedBalance);
		// console.log("stakedBalanceError", stakedBalanceError);
	}, []);

	return (
		<div className="lobby">
			<Modal
				title="Initialisng Game"
				visible={isStakedBalanceLoading}
				footer={null}
				closable={false}>
				<p>Preparing the Knights for war ⚔️</p>
			</Modal>

			<GameOptionsModal
				isModalVisible={isModalVisible}
				setIsModalVisible={setIsModalVisible}
				gameOptions={gameOptions}
				setGameOptions={setGameOptions}
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

			<section className="spectate-wrapper">
				<div className="separator"></div>
				<div className="spectate">
					<div className="game game-1">
						<div className="p1 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>

						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1345)</span>
						</div>
					</div>
					<div className="game game-2">
						<div className="p1 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>
						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1345)</span>
						</div>
					</div>

					<div className="game game-3">
						<div className="p1 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>
						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1345)</span>
						</div>
					</div>
				</div>
			</section>
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

const SamplePgn =
	"1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 g6 5.Bc4 Nb6 6.Bb3 Bg7 7.Qe2 Nc6 8.O-O O-O 9.h3 a5 10.a4 dxe5 11.dxe5 Nd4 12.Nxd4 Qxd4 13.Re1 e6 14.Nd2 Nd5 15.Nf3 Qc5 16.Qe4 Qb4 17.Bc4 Nb6 18.b3 Nxc4 19.bxc4 Re8 20.Rd1 Qc5 21.Qh4 b6 22.Be3 Qc6 23.Bh6 Bh8 24.Rd8 Bb7 25.Rad1 Bg7 26.R8d7 Rf8 27.Bxg7 Kxg7 28.R1d4 Rae8 29.Qf6+ Kg8 30.h4 h5 31.Kh2 Rc8 32.Kg3 Rce8 33.Kf4 Bc8 34.Kg5 1-0";

export default Lobby;

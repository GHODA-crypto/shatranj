import { idToHex } from "helpers/idToInt";
import { useMemo, useEffect, useState } from "react";
import {
	useMoralisQuery,
	useMoralisCloudFunction,
	useMoralis,
} from "react-moralis";
import { GameBoard } from "./Chessboard";
import { useWindowSize } from "../hooks/useWindowSize";
import { Layout, Tabs, Drawer } from "antd";
import {
	FireOutlined,
	InfoCircleOutlined,
	FireFilled,
} from "@ant-design/icons";

import { ReactComponent as Send } from "../assets/send.svg";
import { ReactComponent as WhiteKing } from "../assets/chess_svgs/white_king.svg";
import { ReactComponent as WhiteKnight } from "../assets/chess_svgs/white_knight.svg";
import { ReactComponent as WhiteQueen } from "../assets/chess_svgs/white_queen.svg";
import { ReactComponent as WhiteBishop } from "../assets/chess_svgs/white_bishop.svg";
import { ReactComponent as WhiteRook } from "../assets/chess_svgs/white_rook.svg";
import { ReactComponent as WhitePawn } from "../assets/chess_svgs/white_pawn.svg";
import { ReactComponent as BlackKing } from "../assets/chess_svgs/black_king.svg";
import { ReactComponent as BlackKnight } from "../assets/chess_svgs/black_knight.svg";
import { ReactComponent as BlackQueen } from "../assets/chess_svgs/black_queen.svg";
import { ReactComponent as BlackBishop } from "../assets/chess_svgs/black_bishop.svg";
import { ReactComponent as BlackRook } from "../assets/chess_svgs/black_rook.svg";
import { ReactComponent as BlackPawn } from "../assets/chess_svgs/black_pawn.svg";

import "../styles/game.scss";
const LiveChess = ({ pairingParams, isPairing }) => {
	const [gameId, setGameId] = useState();
	const winSize = useWindowSize();
	const [currentTabletPage, setCurrentTabletPage] = useState(1);
	const [currentMobilePage, setCurrentMobilePage] = useState(2);
	const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);

	const {
		isWeb3Enabled,
		Moralis,
		isWeb3EnableLoading,
		enableWeb3,
		web3,
		user,
	} = useMoralis();
	// Proxy address, Privatekey, Signature
	const proxyAccount = useMemo(() => {
		if (isWeb3Enabled) {
			window.web3 = web3;
			let proxyAccount;
			if (localStorage.getItem("proxyPrivKey")) {
				const privKey = localStorage.getItem("proxyPrivKey");
				proxyAccount = web3.eth.accounts.privateKeyToAccount(privKey);
			} else {
				proxyAccount = web3.eth.accounts.create();

				localStorage.setItem("proxyPrivKey", proxyAccount.privateKey);
			}

			const {
				data: [gameData],
				// error: gameError,
				isLoading: isGameLoading,
			} = useMoralisQuery(
				"Game",
				(query) => query.equalTo("objectId", gameId).limit(1),
				[gameId],
				{
					autoFetch: false,
					live: true,
				}
			);
			return {
				address: proxyAccount.address,
				privateKey: proxyAccount.privateKey,
				sign: proxyAccount.sign,
			};
		}
	}, [isWeb3Enabled, web3.eth.accounts]);

	const signGameAndProxy = (challengeIdHex) => {
		const data = web3.utils.soliditySha3(
			web3.eth.abi.encodeParameters(
				["uint256", "address"],
				[challengeIdHex, proxyAccount.address]
			)
		);

		return web3.eth.personal.sign(data, user.get("ethAddress"));
	};

	const {
		fetch: getChallenge,
		data: challenge,
		// error: challengeError,
		// isLoading: isGettingChallenge,
	} = useMoralisCloudFunction(
		"getChallenge",
		{
			gamePreferences: pairingParams,
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
		(query) => query.find(gameId || "hPUavu3nkjFf5QAcdJp10cEh").limit(1),
		[gameId],
		{
			autoFetch: false,
			live: true,
		}
	);

	useEffect(() => {
		initLiveChess();
	}, []);
	useEffect(() => {
		gameId && fetchGame();
	}, [gameId]);
	useEffect(() => {
		console.log("gameData", gameData);
	}, [gameData]);

	const initLiveChess = async () => {
		await getChallenge();
		if (challenge) {
			const challengeIdHex = idToHex(challenge.objectId);
			const signature = await signGameAndProxy(challengeIdHex);

			const gameId = await Moralis.Cloud.run("acceptChallenge", {
				challengeIdHex: challengeIdHex,
				proxyAddress: proxyAccount?.address,
				signature,
			});
			setGameId(gameId);
		}
	};

	return (
		<MobileView
			isMobileDrawerVisible={isMobileDrawerVisible}
			setIsMobileDrawerVisible={setIsMobileDrawerVisible}
		/>
	);
	// 1200 - 1600

	// 	<TabView
	// 	user={user}
	// 	currentTabletPage={currentTabletPage}
	// 	setCurrentTabletPage={setCurrentTabletPage}
	// />
};

const MobileView = ({ isMobileDrawerVisible, setIsMobileDrawerVisible }) => {
	const { user } = useMoralis();
	const winSize = useWindowSize();
	const { Content } = Layout;
	const { TabPane } = Tabs;

	const styles = {
		Sider: {
			margin: "0",
			padding: "1.5rem",
			borderRadius: "1rem",
			width: "100%",
			height: "100%",
			zIndex: "1",
		},
		Button: {
			position: "absolute",
			top: "1rem",
			right: "1rem",
			width: "3rem",
			height: "3rem",
			borderRadius: "50%",
			border: "none",
			backgroundColor: "#041836",
			color: "#58c563",
			boxShadow: "0px 0px 12px 2px rgb(88,197,99, 0.4)",
		},
	};

	return (
		<Layout className="game-desktop" style={{ position: "relative" }}>
			<button
				className="drawer-btn"
				onClick={() => setIsMobileDrawerVisible(true)}
				style={styles.Button}>
				<FireFilled style={{ margin: "auto", fontSize: "1.5rem" }} />
			</button>
			<Content className="chessboard">
				<div className="players op">
					<div className="player-info">
						<div className="username">0x1234123412321432</div>
						<div className="ilo">(1456)</div>
					</div>
					<div className="fallen-peice fallen-peice-op">
						<WhiteRook size={15} />
						<WhiteKnight size={15} />
						<WhiteBishop size={15} />
					</div>
				</div>

				<GameBoard
					user={user}
					boardWidth={Math.min(winSize.width * 0.6, winSize.height * 0.75)}
				/>

				<div className="players self">
					<div className="player-info">
						<div className="username">
							{user?.attributes?.ethAddress.slice(0, 8)}...
							{user?.attributes?.ethAddress.slice(-9, -1)}
						</div>
						<div className="ilo">(1456)</div>
					</div>
					<div className="fallen-peice fallen-peice-self">
						<BlackPawn size={15} />
						<BlackQueen size={15} />
						<BlackKing size={15} />
					</div>
				</div>
			</Content>

			<Drawer
				className="game-meta"
				placement="right"
				visible={isMobileDrawerVisible}
				onClose={() => setIsMobileDrawerVisible(false)}
				style={styles.Sider}
				width={winSize.width * 0.3}>
				<Tabs
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "space-around",
						color: "white",
					}}
					defaultActiveKey="2"
					tabBarGutter={75}
					centered={true}>
					<TabPane
						tab={
							<span>
								<FireOutlined />
								Chat Room
							</span>
						}
						key="1"
						className="chat-room">
						<div className="prize-pool">
							<span className="label">Prize Pool</span>
							<div className="prize">
								<span className="amount">15</span>
								<span className="ghd">GHD</span>
							</div>
						</div>

						<div className="chat">
							<div className="chat-text"></div>
							<div className="chat-input">
								<input type="text" />
								<button>
									<Send />
								</button>
							</div>
						</div>
					</TabPane>
					<TabPane
						tab={
							<span>
								<InfoCircleOutlined />
								Game Info
							</span>
						}
						key="2"
						className="game-info">
						<div className="pgn"></div>
						<div className="btns">
							<button>Play Again</button>
							<button>Button2</button>
							<button>Button3</button>
							<button className="danger">Button4</button>
						</div>
					</TabPane>
				</Tabs>
			</Drawer>
		</Layout>
	);
};

const TabView = () => {
	const { user } = useMoralis();
	const winSize = useWindowSize();
	const { TabPane } = Tabs;
	const { Content, Sider } = Layout;

	const styles = {
		Sider: {
			margin: "0",
			padding: "1.5rem",
			borderRadius: "1rem",
			width: "100%",
			height: "100%",
			zIndex: "1",
		},
	};

	return (
		<Layout className="game-desktop">
			<Content className="chessboard">
				<div className="players op">
					<div className="player-info">
						<div className="username">0x1234123412321432</div>
						<div className="ilo">(1456)</div>
					</div>
					<div className="fallen-peice fallen-peice-op">
						<WhiteRook size={15} />
						<WhiteKnight size={15} />
						<WhiteBishop size={15} />
					</div>
				</div>

				<GameBoard
					user={user}
					boardWidth={Math.min(winSize.width * 0.6, winSize.height * 0.75)}
				/>

				<div className="players self">
					<div className="player-info">
						<div className="username">
							{user?.attributes?.ethAddress.slice(0, 8)}...
							{user?.attributes?.ethAddress.slice(-9, -1)}
						</div>
						<div className="ilo">(1456)</div>
					</div>
					<div className="fallen-peice fallen-peice-self">
						<BlackPawn size={15} />
						<BlackQueen size={15} />
						<BlackKing size={15} />
					</div>
				</div>
			</Content>

			<Sider
				className="game-meta"
				style={styles.Sider}
				width={winSize.width * 0.3}>
				<Tabs
					style={{
						width: "100%",
						display: "flex",
						justifyContent: "space-around",
						color: "white",
					}}
					defaultActiveKey="2"
					tabBarGutter={75}
					centered={true}>
					<TabPane
						tab={
							<span>
								<FireOutlined />
								Chat Room
							</span>
						}
						key="1"
						className="chat-room">
						<div className="prize-pool">
							<span className="label">Prize Pool</span>
							<div className="prize">
								<span className="amount">15</span>
								<span className="ghd">GHD</span>
							</div>
						</div>

						<div className="chat">
							<div className="chat-text"></div>
							<div className="chat-input">
								<input type="text" />
								<button>
									<Send />
								</button>
							</div>
						</div>
					</TabPane>
					<TabPane
						tab={
							<span>
								<InfoCircleOutlined />
								Game Info
							</span>
						}
						key="2"
						className="game-info">
						<div className="pgn"></div>
						<div className="btns">
							<button>Play Again</button>
							<button>Button2</button>
							<button>Button3</button>
							<button className="danger">Button4</button>
						</div>
					</TabPane>
				</Tabs>
			</Sider>
		</Layout>
	);
};

const DesktopView = ({}) => {
	const winSize = useWindowSize();
	const { user } = useMoralis();
	const styles = {
		Sider: {
			margin: "0",
			padding: "1.5rem",
			borderRadius: "1rem",
			width: "100%",
			zIndex: "1",
		},
	};
	const { Sider, Content } = Layout;

	return (
		<Layout className="game-desktop">
			<Sider
				className="chat-room"
				style={styles.Sider}
				collapsible={true}
				collapsedWidth={0}
				trigger={<FireOutlined size={40} />}
				zeroWidthTriggerStyle={{
					backgroundColor: "rgb(255, 64, 64)",
					borderRadius: "50%",
					width: "3rem",
					height: "3rem",
					top: "5%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					right: "-1.5rem",
				}}
				width={winSize.width * 0.25}>
				<div className="prize-pool">
					<span className="label">Prize Pool</span>
					<div className="prize">
						<span className="amount">15</span>
						<span className="ghd">GHD</span>
					</div>
				</div>

				<div className="chat">
					<div className="chat-text"></div>
					<div className="chat-input">
						<input type="text" />
						<button>
							<Send />
						</button>
					</div>
				</div>
			</Sider>

			<Content className="chessboard">
				<div className="players op">
					<div className="player-info">
						<div className="username">0x1234123412321432</div>
						<div className="ilo">(1456)</div>
					</div>
					<div className="fallen-peice fallen-peice-op">
						<WhiteRook size={15} />
						<WhiteKnight size={15} />
						<WhiteBishop size={15} />
					</div>
				</div>

				<GameBoard
					user={user}
					boardWidth={Math.min(winSize.width * 0.5, winSize.height * 0.7)}
				/>

				<div className="players self">
					<div className="player-info">
						<div className="username">
							{user?.attributes?.ethAddress.slice(0, 8)}...
							{user?.attributes?.ethAddress.slice(-9, -1)}
						</div>
						<div className="ilo">(1456)</div>
					</div>
					<div className="fallen-peice fallen-peice-self">
						<BlackPawn size={15} />
						<BlackQueen size={15} />
						<BlackKing size={15} />
					</div>
				</div>
			</Content>

			<Sider
				className="game-info"
				style={styles.Sider}
				width={winSize.width * 0.25}>
				<div className="pgn"></div>
				<div className="btns">
					<button>Play Again</button>
					<button>Button2</button>
					<button>Button3</button>
					<button className="danger">Button4</button>
				</div>
			</Sider>
		</Layout>
	);
};

export default LiveChess;

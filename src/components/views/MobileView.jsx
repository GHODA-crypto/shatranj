import { useMoralis } from "react-moralis";
import { useState, useEffect, useRef } from "react";
import { Layout, Tabs, Drawer, Row, Col, Skeleton } from "antd";
import {
	FireOutlined,
	InfoCircleOutlined,
	FireFilled,
} from "@ant-design/icons";

import { Send, Abort, Draw, Win } from "./svgs";
import { WhiteCaptured, BlackCaptured, PieceMap } from "./Pieces";

import "../../styles/game.scss";

const MobileView = ({
	isMobileDrawerVisible,
	setIsMobileDrawerVisible,
	opSide,
	children,
	gameBoardProps,
	winSize,
	gameHistory,
	liveGameAttributes,
	captured,
	resignGame,
	claimVictory,
}) => {
	const { user } = useMoralis();
	const [pgnArray, setPgnArray] = useState([[]]);
	const [isWhiteTurn, setIsWhiteTurn] = useState(true);
	const { Content } = Layout;
	const { TabPane } = Tabs;
	const { w: capturedW, b: capturedB } = captured;

	const pgnCurrentRef = useRef(null);

	const scrollPgnToCurrent = () => {
		pgnCurrentRef.current.scrollIntoView({
			behavior: "smooth",
		});
	};

	useEffect(() => {
		scrollPgnToCurrent();
	}, [pgnArray]);

	useEffect(() => {
		if (gameHistory?.length)
			setPgnArray(() => {
				let pgnRenderArray = [];

				for (var i = 0, len = gameHistory.length; i < len; i += 2)
					pgnRenderArray.push(gameHistory.slice(i, i + 2));
				return pgnRenderArray;
			});
	}, [gameHistory?.length]);

	const styles = {
		Drawer: {
			margin: "0",
			padding: "1.5rem",
			width: "100%",
			height: "100%",
			backgroundColor: "#041836",
			boxShadow: "0px 0px 12px 2px rgb(88,197,99, 0.4)",
		},
		Button: {
			position: "absolute",
			top: "-1rem",
			right: "1rem",
			width: "3rem",
			height: "3rem",
			borderRadius: "50%",
			border: "none",
			backgroundColor: "#041836",
			color: "#58c563",
			boxShadow: "0px 0px 12px 2px rgb(88,197,99, 0.4)",
			cursor: "pointer",
		},
	};

	return (
		<Layout className="game-mobile" style={{ position: "relative" }}>
			<button
				className="drawer-btn"
				onClick={() => {
					setIsMobileDrawerVisible(!isMobileDrawerVisible);
					console.log(isMobileDrawerVisible);
				}}
				style={styles.Button}>
				<FireFilled style={{ margin: "auto", fontSize: "1.5rem" }} />
			</button>
			<Content className="chessboard">
				{liveGameAttributes ? (
					<div className="players op">
						<div
							className={
								opSide === "w" && isWhiteTurn
									? "player-info turn"
									: "player-info"
							}>
							<div className="username">
								{liveGameAttributes?.players[opSide]}
							</div>
							<div className="elo">({liveGameAttributes?.ELO[opSide]})</div>
						</div>
						<div className="fallen-peice fallen-peice-op">
							{opSide === "w" ? (
								<WhiteCaptured capturedW={capturedW} />
							) : (
								<BlackCaptured capturedB={capturedB} />
							)}
						</div>
					</div>
				) : (
					<Skeleton active />
				)}

				<div id="gameBoard">{children}</div>

				<div className="players self">
					<div className="fallen-peice fallen-peice-self">
						{opSide === "b" ? (
							<WhiteCaptured capturedW={capturedW} />
						) : (
							<BlackCaptured capturedB={capturedB} />
						)}
					</div>
					<div
						className={
							opSide === "b" && isWhiteTurn ? "player-info turn" : "player-info"
						}>
						<div className="username">{user?.get("ethAddress")}</div>
						<div className="elo">({user?.get("ELO")})</div>
					</div>
				</div>
			</Content>

			<Drawer
				className="game-meta"
				placement="right"
				visible={isMobileDrawerVisible}
				onClose={() => setIsMobileDrawerVisible(false)}
				drawerStyle={styles.Drawer}
				width={Math.max(winSize.width * 0.3, 420)}
				zIndex={1000}>
				<Tabs
					defaultActiveKey="2"
					tabBarGutter={75}
					centered={true}
					className="tabs-container">
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
								<span className="ghd">GHD</span>
								<span className="amount">19</span>
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

						<div className="btns">
							<button className="win" onClick={claimVictory}>
								<Win />
								<span className="text">Claim Win</span>
							</button>
							<button className="draw">
								<Draw />
								<span className="text" style={{ marginTop: "-0.4rem" }}>
									Draw
								</span>
							</button>
							<button className="abort" onClick={resignGame}>
								<Abort />
								<span className="text">Abort</span>
							</button>
						</div>
					</TabPane>
					<TabPane
						tab={
							<span>
								<InfoCircleOutlined />
								Game
							</span>
						}
						key="2"
						className="game-info">
						<div className="pgn">
							{pgnArray.map((row, rowIdx) => (
								<Row key={rowIdx}>
									<Col className="cell cell-1" flex={1}>
										{rowIdx + 1}
									</Col>
									{row.map((col, colIdx) => (
										<Col key={colIdx} className="cell cell-2" flex={2}>
											{col}
										</Col>
									))}
								</Row>
							))}
							<div ref={pgnCurrentRef} />
						</div>
					</TabPane>
				</Tabs>
			</Drawer>
		</Layout>
	);
};

export default MobileView;

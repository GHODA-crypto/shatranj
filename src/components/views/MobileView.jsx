import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { Layout, Tabs, Drawer, Row, Col, Skeleton } from "antd";
import {
	FireOutlined,
	InfoCircleOutlined,
	FireFilled,
} from "@ant-design/icons";

import { ReactComponent as Send } from "../../assets/send.svg";
import { ReactComponent as WhiteKing } from "../../assets/chess_svgs/k_w.svg";
import { ReactComponent as WhiteKnight } from "../../assets/chess_svgs/n_w.svg";
import { ReactComponent as WhiteQueen } from "../../assets/chess_svgs/q_w.svg";
import { ReactComponent as WhiteBishop } from "../../assets/chess_svgs/b_w.svg";
import { ReactComponent as WhiteRook } from "../../assets/chess_svgs/r_w.svg";
import { ReactComponent as WhitePawn } from "../../assets/chess_svgs/p_w.svg";
import { ReactComponent as BlackKing } from "../../assets/chess_svgs/k_b.svg";
import { ReactComponent as BlackKnight } from "../../assets/chess_svgs/n_b.svg";
import { ReactComponent as BlackQueen } from "../../assets/chess_svgs/q_b.svg";
import { ReactComponent as BlackBishop } from "../../assets/chess_svgs/b_b.svg";
import { ReactComponent as BlackRook } from "../../assets/chess_svgs/r_b.svg";
import { ReactComponent as BlackPawn } from "../../assets/chess_svgs/p_b.svg";

import { ReactComponent as Abort } from "../../assets/abort.svg";
import { ReactComponent as Draw } from "../../assets/draw.svg";
import { ReactComponent as Win } from "../../assets/win.svg";

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
	const [wPng, setWPng] = useState([]);
	const [bPng, setBPng] = useState([]);
	const { Content } = Layout;
	const { TabPane } = Tabs;
	const { w, b } = captured;

	useEffect(() => {
		if (gameHistory.length <= 0) return;
		if (gameHistory[gameHistory.length - 1].color === "w") {
			setWPng([...wPng, gameHistory[gameHistory.length - 1].san]);
		} else {
			setBPng([...bPng, gameHistory[gameHistory.length - 1].san]);
		}
	}, [gameHistory]);

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
						<div className="player-info">
							<div className="username">
								{liveGameAttributes?.players[opSide]}
							</div>
							<div className="elo">({liveGameAttributes?.ELO[opSide]})</div>
						</div>
						<div className="fallen-peice fallen-peice-op">
							<div className="bp peice">
								{[...Array(b.p)].map((_, idx) => (
									<WhitePawn key={idx} />
								))}
							</div>
							<div className="bb peice">
								{[...Array(b.b)].map((_, idx) => (
									<WhiteBishop key={idx} />
								))}
							</div>
							<div className="bn peice">
								{[...Array(b.n)].map((_, idx) => (
									<WhiteKnight key={idx} />
								))}
							</div>
							<div className="br peice">
								{[...Array(b.r)].map((_, idx) => (
									<WhiteRook key={idx} />
								))}
							</div>
							<div className="bq peice">
								{[...Array(b.q)].map((_, idx) => (
									<WhiteQueen key={idx} />
								))}
							</div>
						</div>
					</div>
				) : (
					<Skeleton active />
				)}

				<div id="gameBoard">{children}</div>

				<div className="players self">
					<div className="fallen-peice fallen-peice-self">
						<div className="bp peice">
							{[...Array(w.p)].map((_, idx) => (
								<BlackPawn key={idx} />
							))}
						</div>
						<div className="bb peice">
							{[...Array(w.b)].map((_, idx) => (
								<BlackBishop key={idx} />
							))}
						</div>
						<div className="bn peice">
							{[...Array(w.n)].map((_, idx) => (
								<BlackKnight key={idx} />
							))}
						</div>
						<div className="br peice">
							{[...Array(w.r)].map((_, idx) => (
								<BlackRook key={idx} />
							))}
						</div>
						<div className="bq peice">
							{[...Array(w.q)].map((_, idx) => (
								<BlackQueen key={idx} />
							))}
						</div>
					</div>
					<div className="player-info">
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
							{bPng.map((bMove, idx) => (
								<Row key={idx}>
									<Col className="cell cell-1" flex={1}>
										{idx + 1}
									</Col>
									<Col className="cell cell-2" flex={2}>
										{wPng.length !== 0 ? wPng[idx] : ""}
									</Col>
									<Col className="cell cell-2" flex={2}>
										{bMove}
									</Col>
								</Row>
							))}
						</div>
					</TabPane>
				</Tabs>
			</Drawer>
		</Layout>
	);
};

export default MobileView;

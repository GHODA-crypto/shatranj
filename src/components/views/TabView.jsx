import { useMoralis } from "react-moralis";
import { useState, useEffect, useRef } from "react";
import { Layout, Tabs, Row, Col, Skeleton } from "antd";
import { FireOutlined, InfoCircleOutlined } from "@ant-design/icons";

import { Send, Abort, Draw, Win } from "./svgs";
import { WhiteCaptured, BlackCaptured, PieceMap } from "./Pieces";

import "../../styles/game.scss";

const TabView = ({
	opSide,
	children,
	winSize,
	liveGameAttributes,
	gameHistory,
	captured,
	resignGame,
	claimVictory,
}) => {
	const [pgnArray, setPgnArray] = useState([[]]);
	const [isWhiteTurn, setIsWhiteTurn] = useState(true);
	const { user } = useMoralis();
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

	return (
		<Layout className="game-tablet">
			<Content className="chessboard">
				<div id="gameBoard">{children}</div>
			</Content>

			<Sider
				className="game-meta"
				style={styles.Sider}
				width={winSize.width * 0.35}>
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
							<button className={claimVictory}>
								<Win />
								<span className="text">Claim Win</span>
							</button>
							<button>
								<Draw />
								<span className="text" style={{ marginTop: "-0.4rem" }}>
									Draw
								</span>
							</button>
							<button className="danger" onClick={resignGame}>
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
						<div className="players self">
							<div
								className={
									opSide === "b" && isWhiteTurn
										? "player-info turn"
										: "player-info"
								}>
								<div className="username">{user?.get("ethAddress")}</div>
								<div className="elo">({user?.get("ELO")})</div>
							</div>
							<div className="fallen-peice fallen-peice-self">
								{opSide === "b" ? (
									<WhiteCaptured capturedW={capturedW} />
								) : (
									<BlackCaptured capturedB={capturedB} />
								)}
							</div>
						</div>
					</TabPane>
				</Tabs>
			</Sider>
		</Layout>
	);
};

export default TabView;

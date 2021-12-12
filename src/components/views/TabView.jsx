import { useMoralis } from "react-moralis";
import { Layout, Tabs, Drawer } from "antd";
import { FireOutlined, InfoCircleOutlined } from "@ant-design/icons";

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

const TabView = ({
	opSide,
	children,
	winSize,
	liveGameAttributes,
	gameHistory,
}) => {
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
							<button>
								<Win />
								<span className="text">Claim Win</span>
							</button>
							<button>
								<Draw />
								<span className="text" style={{ marginTop: "-0.4rem" }}>
									Draw
								</span>
							</button>
							<button className="danger">
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
						<div className="players op">
							<div className="player-info">
								<div className="username">
									{liveGameAttributes?.players[opSide]}
								</div>
								<div className="elo">({liveGameAttributes?.ELO[opSide]})</div>
							</div>
							<div className="fallen-peice fallen-peice-op">
								<WhiteRook size={15} />
								<WhiteKnight size={15} />
								<WhiteBishop size={15} />
							</div>
						</div>
						<div className="pgn"></div>
						<div className="players self">
							<div className="player-info">
								<div className="username">{user?.get("ethAddress")}</div>
								<div className="elo">({user?.get("ELO")})</div>
							</div>
							<div className="fallen-peice fallen-peice-self">
								<BlackPawn size={15} />
								<BlackQueen size={15} />
								<BlackKing size={15} />
							</div>
						</div>
					</TabPane>
				</Tabs>
			</Sider>
		</Layout>
	);
};

export default TabView;

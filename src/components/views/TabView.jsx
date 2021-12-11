import { useMoralis } from "react-moralis";
import { Layout, Tabs, Drawer } from "antd";
import { FireOutlined, InfoCircleOutlined } from "@ant-design/icons";

import { ReactComponent as Send } from "../../assets/send.svg";
import { ReactComponent as WhiteKing } from "../../assets/chess_svgs/white_king.svg";
import { ReactComponent as WhiteKnight } from "../../assets/chess_svgs/white_knight.svg";
import { ReactComponent as WhiteQueen } from "../../assets/chess_svgs/white_queen.svg";
import { ReactComponent as WhiteBishop } from "../../assets/chess_svgs/white_bishop.svg";
import { ReactComponent as WhiteRook } from "../../assets/chess_svgs/white_rook.svg";
import { ReactComponent as WhitePawn } from "../../assets/chess_svgs/white_pawn.svg";
import { ReactComponent as BlackKing } from "../../assets/chess_svgs/black_king.svg";
import { ReactComponent as BlackKnight } from "../../assets/chess_svgs/black_knight.svg";
import { ReactComponent as BlackQueen } from "../../assets/chess_svgs/black_queen.svg";
import { ReactComponent as BlackBishop } from "../../assets/chess_svgs/black_bishop.svg";
import { ReactComponent as BlackRook } from "../../assets/chess_svgs/black_rook.svg";
import { ReactComponent as BlackPawn } from "../../assets/chess_svgs/black_pawn.svg";

import { ReactComponent as Abort } from "../../assets/abort.svg";
import { ReactComponent as Draw } from "../../assets/draw.svg";
import { ReactComponent as Win } from "../../assets/win.svg";

import "../../styles/game.scss";

const TabView = ({ isPlayerWhite, children, winSize }) => {
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
								<div className="username">0x1234...1234</div>
								<div className="elo">(1456)</div>
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
								<div className="username">
									{user?.attributes?.ethAddress.slice(0, 5)}...
									{user?.attributes?.ethAddress.slice(-6, -1)}
								</div>
								<div className="elo">(1456)</div>
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

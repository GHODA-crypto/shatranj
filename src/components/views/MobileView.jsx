import { useMoralis } from "react-moralis";

import { Layout, Tabs, Drawer } from "antd";
import {
	FireOutlined,
	InfoCircleOutlined,
	FireFilled,
} from "@ant-design/icons";

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

const MobileView = ({
	isMobileDrawerVisible,
	setIsMobileDrawerVisible,
	isPlayerWhite,
	children,
	gameBoardProps,
	winSize,
}) => {
	const { user } = useMoralis();

	const { Content } = Layout;
	const { TabPane } = Tabs;

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
			top: "1rem",
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
		<Layout className="game-desktop" style={{ position: "relative" }}>
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

				<div id="gameBoard">{children}</div>

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
				drawerStyle={styles.Drawer}
				width={Math.max(winSize.width * 0.3, 400)}
				zIndex={1000}>
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

export default MobileView;

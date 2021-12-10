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

const DesktopView = ({ isPlayerWhite, joinLiveChess, children, winSize }) => {
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

			<Sider
				className="game-info"
				style={styles.Sider}
				width={winSize.width * 0.25}>
				<div className="pgn"></div>
				<div className="btns">
					<button onClick={() => joinLiveChess()}>New Game</button>
					<button>Something</button>
					<button>Button3</button>
					<button className="danger">Button4</button>
				</div>
			</Sider>
		</Layout>
	);
};

export default DesktopView;

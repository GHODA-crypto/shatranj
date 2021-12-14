import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { Layout, Skeleton, Row, Col } from "antd";
import { FireOutlined } from "@ant-design/icons";

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
import { ReactComponent as Send } from "../../assets/send.svg";
import { ReactComponent as Abort } from "../../assets/abort.svg";
import { ReactComponent as Draw } from "../../assets/draw.svg";
import { ReactComponent as Win } from "../../assets/win.svg";

const DesktopView = ({
	opSide,
	joinLiveChess,
	children,
	winSize,
	liveGameAttributes,
	isGameLoading,
	gameHistory,
	captured,
	resignGame,
	claimVictory,
}) => {
	const [pgnArray, setPgnArray] = useState([]);
	const [isWhiteTurn, setIsWhiteTurn] = useState(true);
	const { user } = useMoralis();
	console.log(isWhiteTurn);

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
	const { w, b } = captured;
	let tempPgnElement = [];

	useEffect(() => {
		if (gameHistory.length <= 0) return;
		if (gameHistory.length > 1) {
			setIsWhiteTurn(!isWhiteTurn);
		}
		if (tempPgnElement.length < 1) {
			tempPgnElement.push(gameHistory[gameHistory.length - 1]?.san);
			setPgnArray([...pgnArray, tempPgnElement]);
		}
		if (tempPgnElement.length === 1) {
			tempPgnElement.push(gameHistory[gameHistory.length - 1]?.san);
			let temp = pgnArray;
			temp.pop();
			setPgnArray([...temp, tempPgnElement]);
			tempPgnElement = [];
		}
	}, [gameHistory.length]);

	return (
		<Layout className="game-desktop">
			<Sider
				className="chat-room"
				style={styles.Sider}
				collapsible={true}
				collapsedWidth={0}
				trigger={<FireOutlined size={40} />}
				zeroWidthTriggerStyle={{
					backgroundColor: "rgb(255, 64, 64) ",
					borderRadius: "50%",
					width: "3rem",
					height: "3rem",
					top: "5%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					right: "-1.5rem",
				}}
				width={winSize.width * 0.23}>
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
					<button onClick={claimVictory}>
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
			</Sider>

			<Content className="chessboard">
				<div id="gameBoard">{children}</div>
			</Content>

			<Sider
				className="game-info"
				style={styles.Sider}
				width={winSize.width * 0.23}>
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
				</div>
				<div className="players self">
					<div
						className={
							opSide === "b" && isWhiteTurn ? "player-info turn" : "player-info"
						}>
						<div className="username">{user?.get("ethAddress")}</div>
						<div className="elo">({user?.get("ELO")})</div>
					</div>
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
				</div>
			</Sider>
		</Layout>
	);
};

export default DesktopView;

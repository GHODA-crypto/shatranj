import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { Layout, Skeleton, Row, Col } from "antd";
import { FireOutlined } from "@ant-design/icons";
import {
	WhiteKing,
	WhiteKnight,
	WhiteQueen,
	WhiteBishop,
	WhiteRook,
	WhitePawn,
	BlackKing,
	BlackKnight,
	BlackQueen,
	BlackBishop,
	BlackRook,
	BlackPawn,
	Send,
	Abort,
	Draw,
	Win,
} from "./svgs";

const PieceMap = {
	w: {
		k: <WhiteKing style={{ width: 10, height: 10 }} />,
		q: <WhiteQueen style={{ width: 10, height: 10 }} />,
		r: <WhiteRook style={{ width: 10, height: 10 }} />,
		b: <WhiteBishop style={{ width: 10, height: 10 }} />,
		n: <WhiteKnight style={{ width: 10, height: 10 }} />,
		p: <WhitePawn style={{ width: 10, height: 10 }} />,
	},
	b: {
		k: <BlackKing style={{ width: 10, height: 10 }} />,
		q: <BlackQueen style={{ width: 10, height: 10 }} />,
		r: <BlackRook style={{ width: 10, height: 10 }} />,
		b: <BlackBishop style={{ width: 10, height: 10 }} />,
		n: <BlackKnight style={{ width: 10, height: 10 }} />,
		p: <BlackPawn style={{ width: 10, height: 10 }} />,
	},
};

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
	const [isWhiteTurn, setIsWhiteTurn] = useState(true);
	const [pgnArray, setPgnArray] = useState([[]]);
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
	const { w: capturedW, b: capturedBlack } = captured;

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
								{[...Array(capturedBlack.p)].map((_, idx) => (
									<WhitePawn key={idx} />
								))}
							</div>
							<div className="bb peice">
								{[...Array(capturedBlack.b)].map((_, idx) => (
									<WhiteBishop key={idx} />
								))}
							</div>
							<div className="bn peice">
								{[...Array(capturedBlack.n)].map((_, idx) => (
									<WhiteKnight key={idx} />
								))}
							</div>
							<div className="br peice">
								{[...Array(capturedBlack.r)].map((_, idx) => (
									<WhiteRook key={idx} />
								))}
							</div>
							<div className="bq peice">
								{[...Array(capturedBlack.q)].map((_, idx) => (
									<WhiteQueen key={idx} />
								))}
							</div>
						</div>
					</div>
				) : (
					<Skeleton active />
				)}

				<div className="pgn">
					{pgnArray?.map((row, rowIdx) => (
						<Row key={rowIdx}>
							<Col className="cell cell-1" flex={1}>
								{rowIdx + 1}
							</Col>
							{row.map((move, colIdx) => (
								<Col key={colIdx} className="cell cell-2" flex={2}>
									{move.san} {PieceMap[move.color][move.piece]}
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
							{[...Array(capturedW.p)].map((_, idx) => (
								<BlackPawn key={idx} />
							))}
						</div>
						<div className="bb peice">
							{[...Array(capturedW.b)].map((_, idx) => (
								<BlackBishop key={idx} />
							))}
						</div>
						<div className="bn peice">
							{[...Array(capturedW.n)].map((_, idx) => (
								<BlackKnight key={idx} />
							))}
						</div>
						<div className="br peice">
							{[...Array(capturedW.r)].map((_, idx) => (
								<BlackRook key={idx} />
							))}
						</div>
						<div className="bq peice">
							{[...Array(capturedW.q)].map((_, idx) => (
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

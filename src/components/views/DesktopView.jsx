import { useMoralis } from "react-moralis";
import { useState, useEffect, useRef } from "react";
import { Layout, Skeleton, Row, Col } from "antd";
import { FireOutlined } from "@ant-design/icons";
import { Send, Abort, Draw, Win } from "./svgs";
import { WhiteCaptured, BlackCaptured, PieceMap } from "./Pieces";
import { useWindowSize } from "../../hooks/useWindowSize";

const DesktopView = ({
	opSide,
	children,
	liveGameAttributes,
	gameHistory,
	captured,
	resignGame,
	claimVictory,
}) => {
	const [pgnArray, setPgnArray] = useState([[]]);
	const { width } = useWindowSize();
	const { user } = useMoralis();
	const { Sider, Content } = Layout;
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
		<Layout className="game-desktop">
			<Sider
				className="chat-room"
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
				width={width * 0.23}>
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

			<Sider className="game-info" width={width * 0.23}>
				{liveGameAttributes ? (
					<div className="players op">
						<div
							className={
								opSide === liveGameAttributes?.turn
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
								<BlackCaptured capturedB={capturedB} />
							) : (
								<WhiteCaptured capturedW={capturedW} />
							)}
						</div>
					</div>
				) : (
					<Skeleton active />
				)}

				<div className="pgn">
					{pgnArray?.map((row, rowIdx) => (
						<Row key={rowIdx} className="row">
							<Col className="cell cell-1">{rowIdx + 1}</Col>
							{row.map((move, colIdx) => (
								<Col key={colIdx} className="cell cell-2">
									{move.san} {PieceMap[move.color][move.piece]}
								</Col>
							))}
						</Row>
					))}
					<div ref={pgnCurrentRef} />
				</div>
				<div className="players self">
					<div
						className={
							opSide !== liveGameAttributes?.turn
								? "player-info turn"
								: "player-info"
						}>
						<div className="username">{user?.get("ethAddress")}</div>
						<div className="elo">({user?.get("ELO")})</div>
					</div>
					<div className="fallen-peice fallen-peice-self">
						{opSide === "b" ? (
							<BlackCaptured capturedB={capturedB} />
						) : (
							<WhiteCaptured capturedW={capturedW} />
						)}
					</div>
				</div>
			</Sider>
		</Layout>
	);
};

export default DesktopView;

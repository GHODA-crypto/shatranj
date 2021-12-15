import { useMoralis, useMoralisCloudFunction } from "react-moralis";
import { useState, useEffect, useRef, useContext } from "react";
import { Layout, Skeleton, Row, Col } from "antd";
import { FireOutlined } from "@ant-design/icons";
import { Send, Abort, Draw, Win } from "./svgs";
import { WhiteCaptured, BlackCaptured, PieceMap } from "./Pieces";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useSound } from "use-sound";
import SocialNotify from "../../assets/chess_audio/SocialNotify.mp3";
import { LiveChessContext } from "../../context/LiveChessContext";

const DesktopView = ({ children }) => {
	const [pgnArray, setPgnArray] = useState([[]]);
	const { width } = useWindowSize();
	const { user } = useMoralis();
	const { Sider, Content } = Layout;
	const [playSound] = useSound(SocialNotify);
	const { liveGameAttributes, userSide, gameHistory, gameId } =
		useContext(LiveChessContext);

	const { fetch: resignGame } = useMoralisCloudFunction(
		"resign",
		{
			gameId: gameId,
		},
		{
			autoFetch: false,
		}
	);

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
			</Sider>

			<Content className="chessboard">
				<div id="gameBoard">{children}</div>
			</Content>

			<Sider className="game-info" width={width * 0.23}>
				{liveGameAttributes ? (
					<div className="players op">
						<div
							className={
								userSide !== liveGameAttributes?.turn
									? "player-info turn"
									: "player-info"
							}>
							<div className="username">
								{liveGameAttributes?.players?.[userSide === "w" ? "b" : "w"]}
							</div>
							<div className="elo">
								({liveGameAttributes?.ELO?.[userSide === "w" ? "b" : "w"]})
							</div>
						</div>
						<div className="fallen-peice fallen-peice-op">
							{userSide === "b" ? <BlackCaptured /> : <WhiteCaptured />}
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
							userSide === liveGameAttributes?.turn
								? "player-info turn"
								: "player-info"
						}>
						<div className="username">
							{liveGameAttributes?.players?.[userSide === "w" ? "w" : "b"]}
						</div>
						<div className="elo">
							({liveGameAttributes?.ELO?.[userSide === "w" ? "w" : "b"]})
						</div>
					</div>
					<div className="fallen-peice fallen-peice-self">
						{userSide === "w" ? <BlackCaptured /> : <WhiteCaptured />}
					</div>
				</div>
				<div className="btns">
					<button
						onClick={() => {
							// claimVictory();
							playSound();
						}}
						className="win"
						disabled>
						<Win />
						<span className="text">Claim Win</span>
					</button>
					<button className="draw">
						<Draw />
						<span className="text" style={{ marginTop: "-0.4rem" }}>
							Draw
						</span>
					</button>
					<button
						className="abort"
						onClick={() => {
							resignGame();
							playSound();
						}}>
						<Abort />
						<span className="text">Abort</span>
					</button>
				</div>
			</Sider>
		</Layout>
	);
};

export default DesktopView;

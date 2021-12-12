import { useEffect, useState, useMemo } from "react";
import {
	useMoralisQuery,
	useMoralisCloudFunction,
	useMoralis,
} from "react-moralis";
import { useWindowSize } from "../hooks/useWindowSize";
import useBoardWidth from "../hooks/useBoardWidth";
import { Modal, Button } from "antd";

import TabView from "./views/TabView";
import MobileView from "./views/MobileView";
import DesktopView from "./views/DesktopView";

import "../styles/game.scss";
import LiveBoard from "./ChessBoards/Live";
import Chess from "chess.js";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const DEFAULT_GAME = new Chess(DEFAULT_FEN);

const LiveChess = ({
	pairingParams,
	isPairing,
	setIsPairing,
	setPairingParams,
}) => {
	const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);
	const [liveGameAttributes, setLiveGameAttributes] = useState(null);
	const { user, isInitialized } = useMoralis();
	const [game, setGame] = useState(DEFAULT_GAME);
	const gameHistory = useMemo(() => game.history({ verbose: true }), [game]);
	const [needNFT, setNeedNFT] = useState(true);

	const captured = useMemo(
		() =>
			gameHistory.reduce(
				function (acc, move) {
					if ("captured" in move) {
						const piece = move.captured;
						const color = move.color === "w" ? "b" : "w";
						acc[color][piece] += 1;
						return acc;
					} else {
						return acc;
					}
				},
				{
					w: { n: 0, p: 0, b: 0, r: 0, q: 0 },
					b: { n: 0, p: 0, b: 0, r: 0, q: 0 },
				}
			),
		[gameHistory]
	);

	const {
		fetch: joinLiveChess,
		data: challenge,
		// error: challengeError,
		isLoading: joiningLiveChess,
	} = useMoralisCloudFunction(
		"joinLiveChess",
		{
			gamePreferences: pairingParams,
		},
		{
			autoFetch: false,
		}
	);
	const { fetch: doesActiveChallengeExist, data: isLiveChallenge } =
		useMoralisCloudFunction("doesActiveChallengeExist", {});
	useEffect(() => {
		doesActiveChallengeExist();
	}, []);

	const {
		fetch: resignGame,
		data: resignData,
		// error: challengeError,
		isLoading: resigningGame,
	} = useMoralisCloudFunction(
		"resign",
		{
			gameId: gameId,
		},
		{
			autoFetch: false,
		}
	);

	const {
		fetch: claimVictory,
		data: victoryData,
		// error: claimVictoryError,
		isLoading: claimingVictory,
	} = useMoralisCloudFunction(
		"claimVictory",
		{
			needNFT: needNFT,
			gameId: gameId,
		},
		{
			autoFetch: false,
		}
	);

	const {
		data: [liveGameData],
		error: gameError,
		isLoading: isGameLoading,
	} = useMoralisQuery(
		"Game",
		(query) => query.equalTo("challengeId", challenge?.id),
		[challenge],
		{
			autoFetch: true,
			live: true,
		}
	);
	const gameId = useMemo(() => liveGameData?.id, [liveGameData?.id]);

	const {
		data: [liveChallengeData],
		// error: gameError,
		isLoading: isChallengeLoading,
	} = useMoralisQuery(
		"Challenge",
		(query) => query.equalTo("objectId", challenge?.id),
		[challenge],
		{
			autoFetch: true,
			live: true,
		}
	);
	// 0 - pairing
	// 1 - matchFound
	// 2 - in progress
	// 3 - inactive
	// liveChallenge?.get("challengeStatus")

	useEffect(() => {
		setLiveGameAttributes(liveGameData?.attributes);
	}, [liveGameData]);

	useEffect(() => {
		if (isPairing || isLiveChallenge) {
			setIsPairing(false);
			joinLiveChess();
		}
	}, [isPairing, isLiveChallenge]);

	const liveGameObj = useMemo(() => {
		if (liveGameAttributes?.pgn) {
			const _chess = new Chess();
			_chess.load_pgn(liveGameAttributes.pgn);
			return _chess;
		} else {
			return DEFAULT_GAME;
		}
	}, [liveGameAttributes]);

	useEffect(() => {
		if (liveGameObj) setGame(liveGameObj);
	}, [liveGameObj]);

	const isPlayerWhite = useMemo(() => {
		return liveGameData
			? liveGameData.get("sides")?.[user?.get("ethAddress")] === "w"
			: "w";
	}, [liveGameData, user]);

	const winSize = useWindowSize();
	const boardWidth = useBoardWidth();

	window.live = liveGameAttributes;
	window.id = gameId;

	if (winSize.width < 700)
		return (
			<>
				<Modals
					isPlayerWhite={isPlayerWhite}
					game={game}
					liveGameAttributes={liveGameAttributes}
					liveChallengeData={liveChallengeData}
					setNeedNFT={setNeedNFT}
					joinLiveChess={joinLiveChess}
					setPairingParams={setPairingParams}
				/>
				<MobileView
					opSide={isPlayerWhite ? "b" : "w"}
					isMobileDrawerVisible={isMobileDrawerVisible}
					setIsMobileDrawerVisible={setIsMobileDrawerVisible}
					liveGameAttributes={liveGameAttributes}
					gameHistory={gameHistory}
					isGameLoading={isGameLoading}
					winSize={winSize}
					captured={captured}
					resignGame={resignGame}
					claimVictory={claimVictory}>
					<LiveBoard
						liveGameId={gameId}
						user={user}
						isPlayerWhite={isPlayerWhite}
						playerSide={isPlayerWhite ? "w" : "b"}
						boardWidth={boardWidth}
						gameHistory={gameHistory}
						game={game}
						setGame={setGame}
					/>
				</MobileView>
			</>
		);
	else if (winSize.width >= 700 && winSize.width < 1200)
		return (
			<>
				<Modals
					isPlayerWhite={isPlayerWhite}
					game={game}
					liveGameAttributes={liveGameAttributes}
					liveChallengeData={liveChallengeData}
					setNeedNFT={setNeedNFT}
					joinLiveChess={joinLiveChess}
					setPairingParams={setPairingParams}
				/>
				<TabView
					opSide={isPlayerWhite ? "b" : "w"}
					winSize={winSize}
					liveGameAttributes={liveGameAttributes}
					isGameLoading={isGameLoading}
					gameHistory={gameHistory}
					captured={captured}
					resignGame={resignGame}
					claimVictory={claimVictory}>
					<LiveBoard
						liveGameId={gameId}
						user={user}
						isPlayerWhite={isPlayerWhite}
						playerSide={isPlayerWhite ? "w" : "b"}
						boardWidth={boardWidth}
						gameHistory={gameHistory}
						game={game}
						setGame={setGame}
					/>
				</TabView>
			</>
		);
	else
		return (
			<>
				<Modals
					isPlayerWhite={isPlayerWhite}
					game={game}
					liveGameAttributes={liveGameAttributes}
					liveChallengeData={liveChallengeData}
					setNeedNFT={setNeedNFT}
					joinLiveChess={joinLiveChess}
					setPairingParams={setPairingParams}
				/>
				<DesktopView
					opSide={isPlayerWhite ? "b" : "w"}
					joinLiveChess={joinLiveChess}
					winSize={winSize}
					liveGameAttributes={liveGameAttributes}
					isGameLoading={isGameLoading}
					gameHistory={gameHistory}
					captured={captured}
					resignGame={resignGame}
					claimVictory={claimVictory}>
					<LiveBoard
						liveGameId={gameId}
						user={user}
						isPlayerWhite={isPlayerWhite}
						playerSide={isPlayerWhite ? "w" : "b"}
						boardWidth={boardWidth}
						gameHistory={gameHistory}
						game={game}
						setGame={setGame}
					/>
				</DesktopView>
			</>
		);
};

const Modals = ({
	game,
	liveGameAttributes,
	isPlayerWhite,
	liveChallengeData,
	setNeedNFT,
	joinLiveChess,
	setPairingParams,
}) => {
	const handleClaimPool = () => {
		setNeedNFT(false);
	};
	const handleClaimPoolAndNFT = () => {
		setNeedNFT(true);
	};
	const handleQuickMatch = () => {
		setPairingParams({
			lowerElo: 100,
			upperElo: 100,
			preferedSide: "w",
		});
		joinLiveChess();
	};

	return (
		<>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 0}
				footer={null}
				closable={false}>
				<h2>🔍 Finding you a match...</h2>
			</Modal>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 1}
				footer={null}
				closable={false}>
				<h2>Match Found. Waiting for Opponent 🎠 ...</h2>
			</Modal>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 3}
				footer={null}>
				<h2>🤖 Inactivity from the Opponent...</h2>
			</Modal>
			<Modal
				title="Victory"
				visible={
					game.game_over() &&
					((liveGameAttributes?.outcome === 3 && isPlayerWhite) ||
						(liveGameAttributes?.outcome === 4 && !isPlayerWhite))
				}
				footer={[
					<Button key="only Stake" onClick={handleClaimPool}>
						Claim Pool
					</Button>,
					<Button key="with NFT" type="primary" onClick={handleClaimPoolAndNFT}>
						Claim Pool + Mint NFT
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 50}>
				<h1>🎊 You Won the Game 🎊</h1>
				<h3>{liveGameAttributes?.outcome === 3 ? "1 - 0" : "0 - 1"}</h3>
			</Modal>
			<Modal
				title="Defeat"
				visible={
					game.game_over() &&
					(!(liveGameAttributes?.outcome === 3 && isPlayerWhite) ||
						(liveGameAttributes?.outcome === 4 && !isPlayerWhite))
				}
				footer={[
					<Button key="quickMatch" type="primary" onClick={handleQuickMatch}>
						Quick Match
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 50}>
				<h1>🫂 You Lost the Game 🫂</h1>
				<h3>{liveGameAttributes?.outcome === 3 ? "1 - 0" : "0 - 1"}</h3>
			</Modal>
			<Modal
				title="Loading"
				visible={game.game_over() && !liveGameAttributes?.outcome === 2}
				footer={[
					<Button key="quickMatch" type="primary" onClick={handleQuickMatch}>
						Quick Match
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 50}>
				<h1>Game Drawn 😅</h1>
				<h3>1/2 - 1/2</h3>
			</Modal>
		</>
	);
};

export default LiveChess;

//234 dwb
//

import { useEffect, useState, useMemo } from "react";
import {
	useMoralisQuery,
	useMoralisCloudFunction,
	useMoralis,
} from "react-moralis";
import { useWindowSize } from "../hooks/useWindowSize";
import useBoardWidth from "../hooks/useBoardWidth";

import TabView from "./views/TabView";
import MobileView from "./views/MobileView";
import DesktopView from "./views/DesktopView";

import "../styles/game.scss";
import LiveBoard from "./ChessBoards/Live";
import Chess from "chess.js";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const DEFAULT_GAME = new Chess(DEFAULT_FEN);

const LiveChess = ({ pairingParams, isPairing, setIsPairing }) => {
	const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);
	const [liveGameAttributes, setLiveGameAttributes] = useState(null);
	const [liveGamePGN, setLiveGamePGN] = useState(null);
	const { user, isInitialized } = useMoralis();

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

	useEffect(() => {
		setLiveGameAttributes(liveGameData?.attributes);
		setLiveGamePGN(liveGameData?.attributes?.pgn);
	}, [liveGameData]);

	useEffect(() => {
		if (isPairing || isLiveChallenge) {
			setIsPairing(false);
			joinLiveChess();
		}
	}, [isPairing, isLiveChallenge]);

	const [game, setGame] = useState(DEFAULT_GAME);
	const gameHistory = useMemo(() => game.history({ verbose: true }), [game]);
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

	if (winSize.width < 700)
		return (
			<MobileView
				opSide={isPlayerWhite ? "b" : "w"}
				isMobileDrawerVisible={isMobileDrawerVisible}
				setIsMobileDrawerVisible={setIsMobileDrawerVisible}
				liveGameAttributes={liveGameAttributes}
				isGameLoading={isGameLoading}
				winSize={winSize}>
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
		);
	else if (winSize.width >= 700 && winSize.width < 1200)
		return (
			<TabView
				opSide={isPlayerWhite ? "b" : "w"}
				winSize={winSize}
				isGameLoading={isGameLoading}>
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
		);
	else
		return (
			<DesktopView
				opSide={isPlayerWhite ? "b" : "w"}
				joinLiveChess={joinLiveChess}
				winSize={winSize}
				liveGameAttributes={liveGameAttributes}
				isGameLoading={isGameLoading}>
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
		);
};

const VictoryModal = () => {};
const LossModal = () => {};
const DrawModal = () => {};

export default LiveChess;

import { useEffect, useState, useMemo } from "react";
import {
	useMoralisQuery,
	useMoralisCloudFunction,
	useMoralis,
} from "react-moralis";
import { useWindowSize } from "../../hooks/useWindowSize";
import useBoardWidth from "../../hooks/useBoardWidth";

import TabView from "../views/TabView";
import MobileView from "../views/MobileView";
import DesktopView from "../views/DesktopView";

import "../../styles/game.scss";
import LiveBoard from "../ChessBoards/Live";
import Chess from "chess.js";
import Modals from "./Modals";

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
	const [game, setGame] = useState(DEFAULT_GAME);
	const [needNFT, setNeedNFT] = useState(true);

	const { user, isInitialized } = useMoralis();

	const boardWidth = useBoardWidth();

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

	const [gameHistory, setGameHistory] = useState([]);
	useEffect(() => {
		setGameHistory(() => {
			return game.history({ verbose: true });
		});
	}, [game]);

	const gameId = useMemo(() => liveGameData?.id, [liveGameData?.id]);

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

	const liveGameObj = useMemo(() => {
		if (liveGameAttributes?.pgn) {
			const _chess = new Chess();
			_chess.load_pgn(liveGameAttributes.pgn);
			return _chess;
		} else {
			return DEFAULT_GAME;
		}
	}, [liveGameAttributes]);

	const isPlayerWhite = useMemo(() => {
		return liveGameData
			? liveGameData.get("sides")?.[user?.get("ethAddress")] === "w"
			: "w";
	}, [liveGameData, user]);

	useEffect(() => {
		doesActiveChallengeExist();
	}, []);

	useEffect(() => {
		if (isPairing || isLiveChallenge) {
			setIsPairing(false);
			joinLiveChess();
		}
	}, [isPairing, isLiveChallenge]);

	useEffect(() => {
		setLiveGameAttributes(liveGameData?.attributes);
	}, [liveGameData]);

	useEffect(() => {
		if (liveGameObj) setGame(liveGameObj);
	}, [liveGameObj]);

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
		fetch: cancelChallenge,
		data: cancelData,
		// error: challengeError,
		isLoading: cancelingChallenge,
	} = useMoralisCloudFunction(
		"cancelChallenge",
		{},
		{
			autoFetch: false,
		}
	);

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
				cancelChallenge={cancelChallenge}
				cancelingChallenge={cancelingChallenge}
			/>
			<ViewWrapper
				opSide={isPlayerWhite ? "b" : "w"}
				isMobileDrawerVisible={isMobileDrawerVisible}
				setIsMobileDrawerVisible={setIsMobileDrawerVisible}
				liveGameAttributes={liveGameAttributes}
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
			</ViewWrapper>
		</>
	);
};

const ViewWrapper = ({ children, ...rest }) => {
	const { width } = useWindowSize();

	if (width < 700) return <MobileView {...rest}>{children}</MobileView>;
	else if (width >= 700 && width < 1200)
		return <TabView {...rest}>{children}</TabView>;
	else return <DesktopView {...rest}>{children}</DesktopView>;
};

export default LiveChess;

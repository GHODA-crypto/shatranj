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

import { GameBoard } from "./Chessboard";

const LiveChess = ({ pairingParams, isPairing, setIsPairing }) => {
	const [gameId, setGameId] = useState();
	const [playerSide, setPlayerSide] = useState("white");

	const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);

	const { user, isInitialized } = useMoralis();

	const {
		fetch: joinLiveChess,
		data: challenge,
		// error: challengeError,
		isLoading: joiningLiveChess,
	} = useMoralisCloudFunction("joinLiveChess", {
		gamePreferences: pairingParams,
	});

	const {
		data: [liveGameData],
		// error: gameError,
		isLoading: isGameLoading,
	} = useMoralisQuery(
		"Game",
		(query) => query.equalTo("objectId", challenge?.get("gameId")),
		[challenge],
		{
			autoFetch: true,
			live: true,
		}
	);
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
		if (isPairing) {
			setIsPairing(false);
			joinLiveChess();
		}
	}, [isPairing]);
	useEffect(() => {
		if (challenge) setGameId(challenge?.get("gameId"));
	}, [challenge]);

	const [isPlayerWhite, setIsPlayerWhite] = useMemo(() => {
		return liveGameData
			? liveGameData.get("sides")[user.get("ethAddress")] === "w"
			: "w";
	}, [liveGameData, user]);

	const winSize = useWindowSize();
	const boardWidth = useBoardWidth();

	if (winSize.width < 700)
		return (
			<MobileView
				isMobileDrawerVisible={isMobileDrawerVisible}
				setIsMobileDrawerVisible={setIsMobileDrawerVisible}
				isPlayerWhite={isPlayerWhite}
				setIsPlayerWhite={setIsPlayerWhite}
				winSize={winSize}>
				<GameBoard
					user={user}
					isPlayerWhite={isPlayerWhite}
					boardWidth={boardWidth}
				/>
			</MobileView>
		);
	else if (winSize.width >= 700 && winSize.width < 1024)
		return (
			<TabView
				isPlayerWhite={isPlayerWhite}
				setIsPlayerWhite={setIsPlayerWhite}
				winSize={winSize}>
				<GameBoard
					user={user}
					isPlayerWhite={isPlayerWhite}
					boardWidth={boardWidth}
				/>
			</TabView>
		);
	else
		return (
			<DesktopView
				joinLiveChess={joinLiveChess}
				isPlayerWhite={isPlayerWhite}
				setIsPlayerWhite={setIsPlayerWhite}
				winSize={winSize}>
				<GameBoard
					user={user}
					isPlayerWhite={isPlayerWhite}
					boardWidth={boardWidth}
				/>
			</DesktopView>
		);
};

export default LiveChess;

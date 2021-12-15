import { useEffect, useState, useMemo, createContext, useRef } from "react";
import {
	useMoralisQuery,
	useMoralis,
	useMoralisCloudFunction,
} from "react-moralis";
import Move from "../assets/chess_audio/Move.mp3";
import Capture from "../assets/chess_audio/Capture.mp3";
import GenericNotify from "../assets/chess_audio/GenericNotify.mp3";
import useSound from "use-sound";
import Chess from "chess.js";
import useSkinData from "../hooks/useSkinData";
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const DEFAULT_GAME = new Chess(DEFAULT_FEN);

const LiveChessContext = createContext({
	game: null,
	setGame: () => {},
	gameHistory: null,
	setGameHistory: () => {},
	isPlayerWhite: null,
	skins: null,
	isChallengeLoading: null,
	isGameLoading: null,
	gameError: null,
	gameId: null,
	captured: {
		w: { n: 0, p: 0, b: 0, r: 0, q: 0 },
		b: { n: 0, p: 0, b: 0, r: 0, q: 0 },
	},
});

const LiveChessContextProvider = ({ isPairing, children }) => {
	const [playMove] = useSound(Move);
	const [playCapture] = useSound(Capture);
	const [playGenericNotify] = useSound(GenericNotify, { volume: 0.5 });
	const { user } = useMoralis();

	const { fetch: getLiveChallenge, data: liveChallenge } =
		useMoralisCloudFunction(
			"joinExistingChallenge",
			{},
			{
				autoFetch: true,
			}
		);

	useEffect(() => {
		if (user) {
			getLiveChallenge();
		}
	}, [user, isPairing]);

	const {
		liveChallengeData,
		liveGameData,
		gameError,
		isChallengeLoading,
		isGameLoading,
		getGameData,
	} = useGameQueries(liveChallenge?.id);

	useEffect(() => {
		getGameData();
	}, [liveChallenge?.id]);

	// const liveGameAttributes = liveGameData?.attributes;
	const [gameHistory, setGameHistory] = useState([]);

	const gameId = useMemo(() => liveGameData?.id, [liveGameData?.id]);
	const [opponentAddress, setOpponentAddress] = useState(null);

	const [liveGameObj, setLiveGameObj] = useState(DEFAULT_GAME);

	const isPlayerWhite = useMemo(
		() =>
			liveGameData?.attributes?.sides
				? liveGameData?.attributes.sides?.[user?.get("ethAddress")] === "w"
				: false,
		[liveGameData?.attributes.sides, user]
	);
	useEffect(() => {
		setOpponentAddress(liveGameData?.get("players")[isPlayerWhite ? "b" : "w"]);
	}, [liveGameData]);

	const safeGameMutate = (modify) => {
		setLiveGameObj((g) => {
			const update = { ...g };
			modify(update);
			return update;
		});
	};

	const captured = useMemo(() => {
		if (gameHistory)
			return gameHistory?.reduce(
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
			);
		else {
			return {
				w: { n: 0, p: 0, b: 0, r: 0, q: 0 },
				b: { n: 0, p: 0, b: 0, r: 0, q: 0 },
			};
		}
	}, [gameHistory]);

	useEffect(() => {
		console.log("Updating Chess Object");
		const _chess = new Chess();
		_chess.load_pgn(liveGameData?.attributes?.pgn || "");
		setLiveGameObj(_chess);
	}, [liveGameData]);

	useEffect(() => {
		if (liveGameObj.history().length !== gameHistory.length) {
			setGameHistory(() => {
				return liveGameObj.history({ verbose: true });
			});
		}
	}, [liveGameObj]);

	useEffect(() => {
		if (gameHistory) {
			if (liveGameObj.in_check() || liveGameObj.in_checkmate()) {
				playGenericNotify();
			} else {
				playMove();
			}
		}
	}, [gameHistory]);

	const skins = useSkinData(
		user?.get("ethAddress"),
		opponentAddress,
		isPlayerWhite
	);

	return (
		<LiveChessContext.Provider
			value={{
				liveChallengeData: liveChallenge || liveChallengeData,
				userAddress: user?.get("ethAddress"),
				opponentAddress,
				userSide: liveGameData?.attributes?.sides?.[user?.get("ethAddress")],
				game: liveGameObj,
				setGame: setLiveGameObj,
				skins,
				liveGameAttributes: liveGameData?.attributes,
				gameHistory,
				setGameHistory,
				isPlayerWhite,
				isChallengeLoading,
				isGameLoading,
				gameError,
				gameId,
				captured,
			}}>
			{children}
		</LiveChessContext.Provider>
	);
};
const useGameQueries = (liveChallengeId) => {
	const {
		fetch: getLiveChallenge,
		data: [liveChallengeData],
		error: challengeError,
		isLoading: isChallengeLoading,
	} = useMoralisQuery(
		"Challenge",
		(query) => query.equalTo("objectId", liveChallengeId),
		[liveChallengeId],
		{
			autoFetch: false,
			live: true,
		}
	);
	const {
		fetch: getGameData,
		data: [liveGameData],
		error: gameError,
		isLoading: isGameLoading,
	} = useMoralisQuery(
		"Game",
		(query) => query.equalTo("challengeId", liveChallengeId),
		[liveChallengeId],
		{
			autoFetch: false,
			live: true,
		}
	);
	useEffect(() => {
		console.log("fetching game data for challenge", liveChallengeId);
		if (liveChallengeId) {
			getLiveChallenge();
			getGameData();
		}
	}, [getGameData, getLiveChallenge, liveChallengeId]);

	return {
		liveChallengeData,
		liveGameData,
		gameError,
		isChallengeLoading,
		isGameLoading,
		getGameData,
	};
};
export { LiveChessContext, LiveChessContextProvider };

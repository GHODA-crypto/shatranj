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
				autoFetch: false,
			}
		);

	useEffect(() => {
		if (user) {
			console.log("fetching live challenges");
			getLiveChallenge();
		}
	}, [user, isPairing]);

	const {
		// fetch: getChallenge,
		data: [liveChallengeData],
		// error: gameError,
		isLoading: isChallengeLoading,
	} = useMoralisQuery(
		"Challenge",
		(query) => query.equalTo("objectId", liveChallenge?.id),
		[liveChallenge?.id],
		{
			autoFetch: true,
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
		(query) => query.equalTo("challengeId", liveChallenge?.id),
		[liveChallenge?.id],
		{
			live: true,
		}
	);
	useEffect(() => {
		getGameData();
	}, [liveChallenge?.id]);

	// const liveGameAttributes = liveGameData?.attributes;
	const [gameHistory, setGameHistory] = useState([]);

	const gameId = useMemo(() => liveGameData?.id, [liveGameData?.id]);
	const [userAddress, setUserAddress] = useState(null);
	const [opponentAddress, setOpponentAddress] = useState(null);

	const [liveGameObj, setLiveGameObj] = useState(DEFAULT_GAME);

	const [liveGameAttributes, setLiveGameAttributes] = useState({});
	const isPlayerWhite = useMemo(
		() =>
			liveGameAttributes?.sides
				? liveGameAttributes.sides?.[user?.get("ethAddress")] === "w"
				: false,
		[liveGameAttributes.sides, user]
	);
	useEffect(() => {
		setUserAddress(user?.get("ethAddress"));
		setOpponentAddress(liveGameData?.get("players")[isPlayerWhite ? "b" : "w"]);
		// console.log("live game data changed");
		if (liveGameData?.attributes) {
			setLiveGameAttributes(() => {
				// console.log("setting live game attributes");
				return liveGameData.attributes;
			});
		}
	}, [liveGameData]);
	// const liveGameAttributes = liveGameData?.attributes;

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
		// console.log("setting live game object");
		safeGameMutate((livegame) => {
			livegame.load_pgn(liveGameAttributes?.pgn || "");
		});
	}, [liveGameAttributes]);

	useEffect(() => {
		if (liveGameObj.history().length !== gameHistory.length) {
			setGameHistory(() => {
				// console.log("setting game history");

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

	const skins = useSkinData(userAddress, opponentAddress, isPlayerWhite);

	return (
		<LiveChessContext.Provider
			value={{
				liveChallengeData,
				userAddress,
				opponentAddress,
				userSide: liveGameAttributes?.sides?.[user?.get("ethAddress")],
				game: liveGameObj,
				setGame: setLiveGameObj,
				skins,
				liveGameAttributes,
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

export { LiveChessContext, LiveChessContextProvider };

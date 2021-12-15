import { useEffect, useState } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import { useWindowSize } from "../../hooks/useWindowSize";

import TabView from "../views/TabView";
import MobileView from "../views/MobileView";
import DesktopView from "../views/DesktopView";

import "../../styles/game.scss";
import LiveBoard from "../ChessBoards/Live";
import Modals from "./Modals";
import { LiveChessContextProvider } from "../../context/LiveChessContext";

const LiveChess = ({
	pairingParams,
	isPairing,
	setIsPairing,
	setPairingParams,
}) => {
	const { fetch: joinLiveChess } = useMoralisCloudFunction(
		"joinLiveChess",
		{ pairingParams },
		{ autoFetch: false }
	);

	return (
		<LiveChessContextProvider
			setIsPairing={setIsPairing}
			setPairingParams={setPairingParams}
			isPairing={isPairing}
			joinLiveChess={joinLiveChess}>
			<LiveChessWrapper />
		</LiveChessContextProvider>
	);
};
const LiveChessWrapper = ({
	setIsPairing,
	setPairingParams,
	isPairing,
	joinLiveChess,
}) => {
	const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);
	useEffect(() => {
		if (isPairing) {
			setIsPairing(false);
			joinLiveChess();
		}
	}, [isPairing]);
	return (
		<>
			<Modals
				setPairingParams={setPairingParams}
				joinLiveChess={joinLiveChess}
			/>
			<ViewWrapper
				isMobileDrawerVisible={isMobileDrawerVisible}
				setIsMobileDrawerVisible={setIsMobileDrawerVisible}>
				<LiveBoard />
			</ViewWrapper>
		</>
	);
};

const ViewWrapper = ({ gameId, children, ...rest }) => {
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

	const { width } = useWindowSize();

	if (width < 700)
		return (
			<MobileView resignGame={resignGame} {...rest}>
				{children}
			</MobileView>
		);
	else if (width >= 700 && width < 1200)
		return (
			<TabView resignGame={resignGame} {...rest}>
				{children}
			</TabView>
		);
	else
		return (
			<DesktopView resignGame={resignGame} {...rest}>
				{children}
			</DesktopView>
		);
};

export default LiveChess;

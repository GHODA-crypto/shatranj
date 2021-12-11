import { useWindowSize } from "./useWindowSize";

const useBoardWidth = () => {
	const winSize = useWindowSize();
	if (winSize.width < 700)
		return Math.min(winSize.width * 0.8, winSize.height * 0.9);
	else if (winSize.width >= 700 && winSize.width < 1024)
		return Math.min(winSize.width * 0.6, winSize.height * 0.75);
	else return winSize.width * 0.48;
};
export default useBoardWidth;

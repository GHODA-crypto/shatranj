import { useWindowSize } from "./useWindowSize";

const useBoardWidth = () => {
	const winSize = useWindowSize();
	if (winSize.width < 700)
		return Math.min(winSize.width * 0.8, winSize.height * 0.85);
	else if (winSize.width >= 700 && winSize.width < 1200)
		return Math.min(winSize.width * 0.6, winSize.height * 0.85);
	else return Math.min(winSize.width * 0.48, winSize.height * 0.85);
};
export default useBoardWidth;

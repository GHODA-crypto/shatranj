import { useWindowSize } from "./useWindowSize";

const useBoardWidth = (winSize) => {
	if (winSize.width < 768)
		return Math.min(winSize.width * 0.6, winSize.height * 0.75);
	else if (winSize.width >= 768 && winSize.width < 1024)
		return Math.min(winSize.width * 0.6, winSize.height * 0.75);
	else return Math.min(winSize.width * 0.5, winSize.height * 0.7);
};
export default useBoardWidth;

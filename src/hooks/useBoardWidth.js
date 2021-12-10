import { useWindowSize } from "./useWindowSize";

const useBoardWidth = () => {
	const winSize = useWindowSize();
	if (winSize.width < 700)
		return Math.min(winSize.width * 0.8, winSize.height * 0.75);
	else if (winSize.width >= 700 && winSize.width < 1024)
		return Math.min(winSize.width * 0.6, winSize.height * 0.75);
	else return Math.min(winSize.width * 0.45, winSize.height * 0.7);
};
export default useBoardWidth;

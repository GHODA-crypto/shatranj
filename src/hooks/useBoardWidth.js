import { useWindowSize } from "./useWindowSize";

const useBoardWidth = () => {
	const winSize = useWindowSize();
	if (winSize.width < 700) return winSize.width * 0.8;
	else if (winSize.width >= 700 && winSize.width < 1200)
		return winSize.width * 0.6;
	else return winSize.width * 0.48;
};
export default useBoardWidth;

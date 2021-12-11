export const numDisplayFormatter = (number) => {
	if (number > 999999999) {
		return (number / 1000000000).toFixed(1) + "B";
	} else if (number > 999999) {
		return (number / 1000000).toFixed(1) + "M";
	} else if (number > 999) {
		return (number / 1000).toFixed(1) + "K";
	}
	return number;
};

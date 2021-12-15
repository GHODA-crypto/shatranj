import { Skeleton } from "antd";
import Blockies from "react-blockies";
import { useMoralis } from "react-moralis";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {
	const { user } = useMoralis();
	if (!props.address && !user.get("ethAddress"))
		return <Skeleton.Avatar active size={40} />;

	return (
		<Blockies
			seed={
				props.currentWallet
					? user.get("ethAddress").toLowerCase()
					: props.address.toLowerCase()
			}
			className="identicon"
			{...props}
		/>
	);
}

export default Blockie;

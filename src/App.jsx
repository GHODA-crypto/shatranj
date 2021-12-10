import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

import Account from "./components/Account";
import Chains from "./components/Chains";
import Stakes from "./components/Stakes";
import ERC20Transfers from "./components/ERC20Transfers";
import NFTBalance from "./components/NFTBalance";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import MenuItems from "./components/MenuItems";
import Lobby from "./components/Lobby";
import LiveChess from "./components/LiveChess";
import TestCloudFunctions from "./components/TestCloudFunctions";

const { Header } = Layout;

const styles = {
	content: {
		display: "flex",
		justifyContent: "center",
		fontFamily: "Roboto, sans-serif",
		color: "#041836",
		marginTop: "40px",
		padding: "10px",
	},
	header: {
		position: "fixed",
		zIndex: 1,
		width: "100%",
		background: "#fff",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		fontFamily: "Poppins, sans-serif",
		borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
		padding: "0 10px",
		boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
		userSelect: "none",
	},
	headerRight: {
		display: "flex",
		gap: "20px",
		alignItems: "center",
		fontSize: "15px",
		fontWeight: "600",
	},
};

const App = ({ isServerInfo }) => {
	const {
		isWeb3Enabled,
		enableWeb3,
		isAuthenticated,
		isWeb3EnableLoading,
		user,
	} = useMoralis();

	const [isPairing, setIsPairing] = useState(false);
	const [pairingParams, setPairingParams] = useState({});

	useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isWeb3Enabled]);

	return (
		<Layout style={{ height: "100vh", overflow: "auto" }}>
			<Router>
				{isPairing && <Redirect to="/live-chess" />}

				<Nav />
				<div style={styles.content}>
					<Switch>
						<Route exact path="/lobby">
							<Lobby setIsPairing={setIsPairing} />
						</Route>
						<Route path="/stakes">
							<Stakes />
						</Route>
						<Route path="/erc20transfers">
							<ERC20Transfers />
						</Route>
						<Route path="/nftBalance">
							<NFTBalance />
						</Route>
						<Route user={user} path="/live-chess">
							<LiveChess
								user={user}
								isPairing={isPairing}
								setIsPairing={setIsPairing}
								pairingParams={pairingParams}
							/>
						</Route>
						<Route path="/testcloud">
							<TestCloudFunctions />
						</Route>
						<Route path="/">
							<Redirect to="/lobby" />
						</Route>
						{/* <Route path="/nonauthenticated">
							<>Please login using the "Authenticate" button</>
						</Route> */}
					</Switch>
				</div>
			</Router>
		</Layout>
	);
};

const Nav = () => {
	return (
		<Header style={styles.header}>
			<Logo />
			<MenuItems />
			<div style={styles.headerRight}>
				<Chains />
				{/* <NativeBalance /> */}
				<Account />
			</div>
		</Header>
	);
};

function PrivateRoute({ user, children, ...rest }) {
	// const { user } = useMoralis();
	// console.log("isAuthenticated", isAuthenticated);
	console.log("user", user);
	return (
		<Route
			{...rest}
			render={() => {
				return user ? children : <Redirect to="/lobby" />;
			}}
		/>
	);
}

export const Logo = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-around",
			padding: "0.5rem",
		}}>
		<svg
			version="1.0"
			xmlns="http://www.w3.org/2000/svg"
			width="30pt"
			height="25pt"
			viewBox="0 0 512.000000 512.000000"
			preserveAspectRatio="xMidYMid meet">
			<g
				transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
				fill="#278C5A"
				stroke="none">
				<path
					d="M1100 4970 l0 -150 150 0 150 0 0 -1005 0 -1005 257 0 258 0 247 247
248 248 0 -285 0 -285 -605 -605 -605 -605 0 -162 0 -163 1360 0 1360 0 0
1323 c0 1428 -1 1436 -54 1618 -130 445 -480 795 -925 925 -172 50 -235 54
-1068 54 l-773 0 0 -150z"
				/>
				<path
					d="M900 600 l0 -300 -150 0 -150 0 0 -150 0 -150 1960 0 1960 0 0 150 0
150 -150 0 -150 0 0 300 0 300 -1660 0 -1660 0 0 -300z"
				/>
			</g>
		</svg>
		<div
			className="logo-txt"
			style={{
				// fontFamily: "Poppins, sans-serif",
				fontSize: "2.25em",
				fontWeight: "700",
				// textTransform: "uppercase",
				marginTop: "0.35rem",
				color: "#00150B",
				userSelect: "none",
			}}>
			Shatranj
		</div>
	</div>
);

export default App;

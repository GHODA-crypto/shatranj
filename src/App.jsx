import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Layout } from "antd";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

import Account from "./components/Account";
import Chains from "./components/Chains";
import Stakes from "./components/Stakes";
import NFTBalance from "./components/NFTBalance";
import MenuItems from "./components/MenuItems";
import Lobby from "./components/Lobby";
import LiveChess from "./components/LiveChess";

import { ReactComponent as LogoArt } from "./assets/logo.svg";

import "./styles/main.scss";
import "./style.css";
import "antd/dist/antd.css";

const { Header } = Layout;

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
						<Route path="/nftBalance">
							<NFTBalance />
						</Route>
						<PrivateRoute user={user} path="/live-chess">
							<LiveChess
								user={user}
								isPairing={isPairing}
								setIsPairing={setIsPairing}
								pairingParams={pairingParams}
								setPairingParams={setPairingParams}
							/>
						</PrivateRoute>
						<Route path="/">
							<Redirect to="/lobby" />
						</Route>
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
				<Account />
			</div>
		</Header>
	);
};

function PrivateRoute({ user, children, ...rest }) {
	return (
		<Route
			{...rest}
			render={() => {
				return user ? children : <Redirect to="/lobby" />;
			}}
		/>
	);
}

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
		zIndex: 9999,
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

export const Logo = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-around",
			padding: "0.5rem",
		}}>
		<LogoArt />
		<div
			className="logo-txt"
			style={{
				fontSize: "2.25em",
				fontWeight: "700",
				marginTop: "0.35rem",
				color: "#00150B",
				userSelect: "none",
			}}>
			Shatranj
		</div>
	</div>
);

export default App;

import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

import Account from "./components/Account";
import Chains from "./components/Chains";
// import TokenPrice from "./components/TokenPrice";
import ERC20Balance from "./components/ERC20Balance";
import ERC20Transfers from "./components/ERC20Transfers";
// import InchDex from "./components/InchDex";
import NFTBalance from "./components/NFTBalance";
import Wallet from "./components/Wallet";
import { Layout, Tabs } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "./components/NativeBalance";
import "./style.css";
// import QuickStart from "./components/QuickStart";
// import Contract from "./components/Contract/Contract";
import Text from "antd/lib/typography/Text";
// import Ramper from "./components/Ramper";
import MenuItems from "./components/MenuItems";
import Lobby from "./components/Lobby";
const { Header, Footer } = Layout;

const styles = {
	content: {
		display: "flex",
		justifyContent: "center",
		fontFamily: "Roboto, sans-serif",
		color: "#041836",
		marginTop: "130px",
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
		fontFamily: "Roboto, sans-serif",
		borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
		padding: "0 10px",
		boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
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
	const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
		useMoralis();

	useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isWeb3Enabled]);

	return (
		<Layout style={{ height: "100vh", overflow: "auto" }}>
			<Router>
				<Header style={styles.header}>
					<Logo />
					<MenuItems />
					<div style={styles.headerRight}>
						<Chains />
						{/* <TokenPrice
							address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
							chain="eth"
							image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/"
							size="40px"
						/> */}
						<NativeBalance />
						<Account />
					</div>
				</Header>

				<div style={styles.content}>
					<Switch>
						<Route exact path="/lobby">
							<Lobby />
						</Route>
						{/* <Route exact path="/quickstart">
							<QuickStart isServerInfo={isServerInfo} />
						</Route>
						<Route path="/wallet">
							<Wallet />
						</Route> */}
						<Route path="/erc20balance">
							<ERC20Balance />
						</Route>
						<Route path="/erc20transfers">
							<ERC20Transfers />
						</Route>
						<Route path="/nftBalance">
							<NFTBalance />
						</Route>
						{/* <Route path="/contract">
							<Contract />
						</Route> */}
						<Route path="/">
							<Redirect to="/lobby" />
						</Route>
						<Route path="/ethereum-boilerplate">
							<Redirect to="/quickstart" />
						</Route>
						<Route path="/nonauthenticated">
							<>Please login using the "Authenticate" button</>
						</Route>
					</Switch>
				</div>
			</Router>
			<Footer style={{ textAlign: "center" }}>
				<Text style={{ display: "block" }}>
					⭐️ Please star this{" "}
					<a
						href="https://github.com/ethereum-boilerplate/ethereum-boilerplate/"
						target="_blank"
						rel="noopener noreferrer">
						boilerplate
					</a>
					, every star makes us very happy!
				</Text>

				<Text style={{ display: "block" }}>
					🙋 You have questions? Ask them on the {""}
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://forum.moralis.io/t/ethereum-boilerplate-questions/3951/29">
						Moralis forum
					</a>
				</Text>

				<Text style={{ display: "block" }}>
					📖 Read more about{" "}
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://moralis.io?utm_source=boilerplatehosted&utm_medium=todo&utm_campaign=ethereum-boilerplat">
						Moralis
					</a>
				</Text>
			</Footer>
		</Layout>
	);
};

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
			}}>
			Shatranj
		</div>
	</div>
);

export default App;

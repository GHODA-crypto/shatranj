import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useWindowSize } from "../hooks/useWindowSize";

function MenuItems() {
	const { pathname } = useLocation();
	const { width } = useWindowSize();

	return (
		<Menu
			theme="light"
			mode="horizontal"
			style={{
				display: "flex",
				fontSize: width > 860 ? "18px" : "22px",
				fontWeight: "500",
				width: "100%",
				justifyContent: "center",
				userSelect: "none",
			}}
			defaultSelectedKeys={[pathname]}>
			<Menu.Item key="/lobby">
				<NavLink to="/lobby">♟️ Lobby</NavLink>
			</Menu.Item>
			<Menu.Item key="/stakes">
				<NavLink to="/stakes">💰 Stakes</NavLink>
			</Menu.Item>
			<Menu.Item key="/nftBalance">
				<NavLink to="/nftBalance">🖼 NFTs</NavLink>
			</Menu.Item>
		</Menu>
	);
}

export default MenuItems;

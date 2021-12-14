import { Modal, Radio, InputNumber } from "antd";
import { ReactComponent as WKing } from "../../assets/chess_svgs/k_w.svg";
import { ReactComponent as BKing } from "../../assets/chess_svgs/k_b.svg";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useMoralis } from "react-moralis";

const GameOptionsModal = ({
	isModalVisible,
	setIsModalVisible,
	gameOptions,
	setGameOptions,
}) => {
	const handleOk = () => {
		setIsModalVisible(false);
	};

	const winSize = useWindowSize();
	const { user } = useMoralis();

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<Modal
			title="Game Options"
			className="options-modal"
			okText="Create Game"
			width={"50ch"}
			height={winSize.height > 300 ? "50%" : "100%"}
			bodyStyle={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-around",
				alignItems: "center",
				padding: "2rem",
				userSelect: "none",
			}}
			visible={isModalVisible}
			onOk={handleOk}
			onCancel={handleCancel}>
			<Radio.Group
				value={gameOptions.color}
				style={{
					width: "35%",
					display: "flex",
					justifyContent: "space-around",
					alignItems: "center",
				}}
				onChange={(e) => {
					// console.log(e);
					setGameOptions({ ...gameOptions, color: e.target.value });
				}}
				className="wb-group"
				defaultValue="w"
				size="large"
				buttonStyle="solid">
				<Radio.Button
					label="Choose Sides"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						borderRadius: "0.5rem",
						width: "4rem",
						height: "4rem",
						marginRight: "1rem",
					}}
					className="wb"
					value="w">
					<WKing style={{ marginTop: "0.5rem", width: 30, height: 30 }} />
				</Radio.Button>
				<Radio.Button
					label="Choose Sides"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						borderRadius: "0.5rem",
						width: "4rem",
						height: "4rem",
					}}
					className="wb"
					value="b">
					<BKing style={{ marginTop: "0.5rem", width: 30, height: 30 }} />
				</Radio.Button>
			</Radio.Group>
			<div
				className="rating"
				style={{
					marginTop: "2rem",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-around",
					alignItems: "center",
					width: "80%",
					height: "40%",
				}}>
				<span
					className="title"
					style={{
						width: "100%",
						fontSize: "1.2rem",
						fontWeight: "600",
						textAlign: "center",
						marginBottom: "1rem",
					}}>
					Rating Range
				</span>
				<div
					className="rating-input"
					style={{
						fontSize: "1.5rem",
						fontWeight: 600,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<span
						className="label inc"
						style={{
							fontSize: "1.5rem",
							fontWeight: 600,
							marginRight: "0.25rem",
						}}>
						+
					</span>
					<span className="user-elo">{user?.get("ELO")}</span>
					<InputNumber
						size="large"
						min={1}
						max={10000}
						value={gameOptions.rangeUpper}
						onChange={(val) => {
							setGameOptions({ ...gameOptions, rangeUpper: val });
						}}
					/>
					<span
						className="label dec"
						style={{
							fontSize: "1.5rem",
							fontWeight: 600,
							marginRight: "0.25rem",
							marginLeft: "1rem",
						}}>
						-
					</span>
					<InputNumber
						size="large"
						min={1}
						max={10000}
						value={gameOptions.rangeLower}
						onChange={(val) => {
							// console.log(e);
							setGameOptions({ ...gameOptions, rangeLower: val });
						}}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default GameOptionsModal;

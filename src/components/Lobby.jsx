import React, { useState } from "react";
import { ReactComponent as WKing } from "../assets/chess_svgs/white_king.svg";
import { ReactComponent as BKing } from "../assets/chess_svgs/black_king.svg";
import { ShowBoard } from "./Chessboard.jsx";
import { useWindowSize } from "../hooks/useWindowSize";
import { Radio, InputNumber, Modal, message } from "antd";
import "../styles/lobby.scss";
import { useMoralis, useMoralisQuery } from "react-moralis";

const Lobby = ({ user, setIsPairing }) => {
	const [gameOptions, setGameOptions] = useState({
		color: "w",
		rangeUpper: 100,
		rangeLower: 100,
	});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const winSize = useWindowSize();

	const handleCreateGame = () => {
		!user ? error() : showModal();
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const error = () => {
		message.error("Wallet not Connected! Connect Wallet!");
	};

	const { Moralis, isAuthenticated } = useMoralis();
	const SamplePgn =
		"1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 g6 5.Bc4 Nb6 6.Bb3 Bg7 7.Qe2 Nc6 8.O-O O-O 9.h3 a5 10.a4 dxe5 11.dxe5 Nd4 12.Nxd4 Qxd4 13.Re1 e6 14.Nd2 Nd5 15.Nf3 Qc5 16.Qe4 Qb4 17.Bc4 Nb6 18.b3 Nxc4 19.bxc4 Re8 20.Rd1 Qc5 21.Qh4 b6 22.Be3 Qc6 23.Bh6 Bh8 24.Rd8 Bb7 25.Rad1 Bg7 26.R8d7 Rf8 27.Bxg7 Kxg7 28.R1d4 Rae8 29.Qf6+ Kg8 30.h4 h5 31.Kh2 Rc8 32.Kg3 Rce8 33.Kf4 Bc8 34.Kg5 1-0";

	const quickMatch = (e) => {
		if (!user) {
			error();
			return;
		}
		console.log(isAuthenticated);
		if (isAuthenticated) {
			setIsPairing(true);
		}
	};

	return (
		<div className="lobby">
			<GameOptionsModal
				winSize={winSize}
				isModalVisible={isModalVisible}
				setIsModalVisible={setIsModalVisible}
				gameOptions={gameOptions}
				setGameOptions={setGameOptions}
			/>

			<section className="play">
				<button className="join-game-btn" onClick={quickMatch}>
					🚀
					<span className="btn-text">Quick Match</span>
				</button>
				<button className="create-game-btn" onClick={handleCreateGame}>
					🛠️
					<span className="btn-text">Create Game</span>
				</button>
			</section>

			<section className="spectate-wrapper">
				<div className="separator"></div>
				<div className="spectate">
					<div className="game game-1">
						<div className="p1 p">
							<span className="username">0x123122312233</span>
							<span className="ilo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>

						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="ilo">(1345)</span>
						</div>
					</div>
					<div className="game game-2">
						<div className="p1 p">
							<span className="username">0x123122312233</span>
							<span className="ilo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>
						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="ilo">(1345)</span>
						</div>
					</div>
					<div className="game game-3">
						<div className="p1 p">
							<span className="username">0x123122312233</span>
							<span className="ilo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>
						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="ilo">(1345)</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

const GameOptionsModal = ({
	winSize,
	isModalVisible,
	setIsModalVisible,
	gameOptions,
	setGameOptions,
}) => {
	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<Modal
			title="Game Options"
			className="options-modal"
			okText="Create Game"
			width={winSize.width > 600 ? "20%" : "100%"}
			height={winSize.height > 300 ? "50%" : "100%"}
			bodyStyle={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-around",
				alignItems: "center",
				padding: "2rem",
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
					<WKing style={{ marginTop: "0.5rem" }} />
				</Radio.Button>
				<Radio.Button
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
					<BKing style={{ marginTop: "0.5rem" }} />
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

export default Lobby;

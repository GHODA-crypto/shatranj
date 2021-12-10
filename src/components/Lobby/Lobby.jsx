import React, { useState } from "react";
import { ShowBoard } from "../Chessboard";
import { notification } from "antd";
import "../../styles/lobby.scss";
import { useMoralis, useMoralisQuery } from "react-moralis";
import GameOptionsModal from "./GameOptionsModal";
import { useWindowSize } from "../../hooks/useWindowSize";

const Lobby = ({ setIsPairing }) => {
	const [gameOptions, setGameOptions] = useState({
		color: "w",
		rangeUpper: 100,
		rangeLower: 100,
	});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { winSize } = useWindowSize();
	console.log(winSize);

	const handleCreateGame = () => {
		!user ? openErrorNotification() : showModal();
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	// const error = () => {
	// 	message.error("Wallet not Connected! Connect Wallet!");
	// };

	const openErrorNotification = () => {
		notification["error"]({
			message: "User not Authenticated",
			description:
				"Please connect your wallet to create a game. You can connect your wallet by clicking on the authenticate button in the top right corner.",
			placement: "bottomRight",
		});
	};

	const { Moralis, isAuthenticated, user } = useMoralis();
	const SamplePgn =
		"1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 g6 5.Bc4 Nb6 6.Bb3 Bg7 7.Qe2 Nc6 8.O-O O-O 9.h3 a5 10.a4 dxe5 11.dxe5 Nd4 12.Nxd4 Qxd4 13.Re1 e6 14.Nd2 Nd5 15.Nf3 Qc5 16.Qe4 Qb4 17.Bc4 Nb6 18.b3 Nxc4 19.bxc4 Re8 20.Rd1 Qc5 21.Qh4 b6 22.Be3 Qc6 23.Bh6 Bh8 24.Rd8 Bb7 25.Rad1 Bg7 26.R8d7 Rf8 27.Bxg7 Kxg7 28.R1d4 Rae8 29.Qf6+ Kg8 30.h4 h5 31.Kh2 Rc8 32.Kg3 Rce8 33.Kf4 Bc8 34.Kg5 1-0";

	const quickMatch = (e) => {
		setIsPairing(true);
		if (!user) {
			openErrorNotification();
			return;
		}
	};

	return (
		<div className="lobby">
			<GameOptionsModal
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
							<span className="elo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>

						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1345)</span>
						</div>
					</div>
					<div className="game game-2">
						<div className="p1 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>
						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1345)</span>
						</div>
					</div>

					<div className="game game-3">
						<div className="p1 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1414)</span>
						</div>
						<div className="board">
							<ShowBoard boardWidth={300} pgn={SamplePgn} />
						</div>
						<div className="p2 p">
							<span className="username">0x123122312233</span>
							<span className="elo">(1345)</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Lobby;

import React, { useState } from "react";
import { ReactComponent as Play } from "../assets/chess.svg";
import { ReactComponent as WKing } from "../assets/chess_svgs/white_king.svg";
import { ReactComponent as BKing } from "../assets/chess_svgs/black_king.svg";
import { ShowBoard } from "./Chessboard.jsx";
import { Radio, InputNumber } from "antd";
import "../styles/lobby.scss";

const Lobby = () => {
	const [rangeUpper, setRangeUpper] = useState(1);
	const [color, setColor] = useState("w");

	const handleChange = (value) => {
		setTime(value);
	};

	const SamplePgn =
		"1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 g6 5.Bc4 Nb6 6.Bb3 Bg7 7.Qe2 Nc6 8.O-O O-O 9.h3 a5 10.a4 dxe5 11.dxe5 Nd4 12.Nxd4 Qxd4 13.Re1 e6 14.Nd2 Nd5 15.Nf3 Qc5 16.Qe4 Qb4 17.Bc4 Nb6 18.b3 Nxc4 19.bxc4 Re8 20.Rd1 Qc5 21.Qh4 b6 22.Be3 Qc6 23.Bh6 Bh8 24.Rd8 Bb7 25.Rad1 Bg7 26.R8d7 Rf8 27.Bxg7 Kxg7 28.R1d4 Rae8 29.Qf6+ Kg8 30.h4 h5 31.Kh2 Rc8 32.Kg3 Rce8 33.Kf4 Bc8 34.Kg5 1-0";

	return (
		<div className="lobby">
			<section className="play">
				{/* <div className="game-options">
					<Radio.Group
						value={color}
						onChange={(e) => setColor(e.target.value)}
						className="wb-group"
						defaultValue="w"
						size="large"
						buttonStyle="solid">
						<Radio.Button className="wb" value="w">
							<WKing />
						</Radio.Button>
						<Radio.Button className="wb" value="b">
							<BKing />
						</Radio.Button>
					</Radio.Group>
					<div className="time">
						<div className="icon fast">🚀</div>
						<Slider
							min={1}
							max={10}
							style={{ width: "10rem", margin: "0 2rem" }}
							onChange={handleChange}
							value={time}
						/>
						<div className="icon slow">🕰️</div>
					</div>
					<div className="time-value">{time} min</div>
				</div> */}
				<div className="join-game">
					<button>
						<Play width="30pt" height="30pt" />
						<span className="btn-text">Play Now</span>
					</button>
				</div>
				<div className="create-game">
					<Radio.Group
						value={color}
						onChange={(e) => setColor(e.target.value)}
						className="wb-group"
						defaultValue="w"
						size="large"
						buttonStyle="solid">
						<Radio.Button className="wb" value="w">
							<WKing />
						</Radio.Button>
						<Radio.Button className="wb" value="b">
							<BKing />
						</Radio.Button>
					</Radio.Group>
					<InputNumber
						size="large"
						min={1}
						max={100000}
						defaultValue={3}
						onChange={onChange}
					/>
				</div>
			</section>
			<section className="spectate-wrapper">
				<div className="title"></div>
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

export default Lobby;

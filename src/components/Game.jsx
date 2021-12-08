import React from "react";
import { GameBoard } from "./Chessboard";

import { ReactComponent as Send } from "../assets/send.svg";
import { ReactComponent as WhiteKing } from "../assets/chess_svgs/white_king.svg";
import { ReactComponent as WhiteKnight } from "../assets/chess_svgs/white_knight.svg";
import { ReactComponent as WhiteQueen } from "../assets/chess_svgs/white_queen.svg";
import { ReactComponent as WhiteBishop } from "../assets/chess_svgs/white_bishop.svg";
import { ReactComponent as WhiteRook } from "../assets/chess_svgs/white_rook.svg";
import { ReactComponent as WhitePawn } from "../assets/chess_svgs/white_pawn.svg";
import { ReactComponent as BlackKing } from "../assets/chess_svgs/black_king.svg";
import { ReactComponent as BlackKnight } from "../assets/chess_svgs/black_knight.svg";
import { ReactComponent as BlackQueen } from "../assets/chess_svgs/black_queen.svg";
import { ReactComponent as BlackBishop } from "../assets/chess_svgs/black_bishop.svg";
import { ReactComponent as BlackRook } from "../assets/chess_svgs/black_rook.svg";
import { ReactComponent as BlackPawn } from "../assets/chess_svgs/black_pawn.svg";

import "../styles/game.scss";

const Game = ({ user, isMatching2x }) => {
	return (
		<div className="game">
			<section className="game-btns">
				<div className="prize-pool">
					<span className="label">Prize Pool</span>
					<div className="prize">
						<span className="amount">15</span>
						<span className="ghd">GHD</span>
					</div>
				</div>

				<div className="chat">
					<div className="chat-text"></div>
					<div className="chat-input">
						<input type="text" />
						<button>
							<Send />
						</button>
					</div>
				</div>
			</section>
			<section className="chessboard">
				<div className="players op">
					<div className="player-info">
						<div className="username">0x1234123412321432</div>
						<div className="ilo">(1456)</div>
					</div>
					<div className="fallen-peice fallen-peice-op">
						<WhiteRook size={15} />
						<WhiteKnight size={15} />
						<WhiteBishop size={15} />
					</div>
				</div>

				<GameBoard user={user} boardWidth={750} />

				<div className="players self">
					<div className="player-info">
						<div className="username">0x1234123412321432</div>
						<div className="ilo">(1456)</div>
					</div>
					<div className="fallen-peice fallen-peice-self">
						<BlackPawn size={15} />
						<BlackQueen size={15} />
						<BlackKing size={15} />
					</div>
				</div>
			</section>
			<section className="game-info">
				<div className="pgn"></div>
				<div className="btns">
					<button>Button1</button>
					<button>Button2</button>
					<button>Button3</button>
					<button className="danger">Button4</button>
				</div>
			</section>
		</div>
	);
};

export default Game;

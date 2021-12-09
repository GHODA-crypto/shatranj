import { idToHex } from "helpers/idToInt";
import { useMemo, useEffect, useState } from "react";
import {
	useMoralisQuery,
	useMoralisCloudFunction,
	useMoralis,
} from "react-moralis";
import { GameBoard } from "./Chessboard";
import { useWindowSize } from "../hooks/useWindowSize";

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
const LiveChess = ({ pairingParams, isPairing }) => {
	// const { isWeb3Enabled, Moralis, isWeb3EnableLoading, web3, user } =
	// 	useMoralis();
	const [gameId, setGameId] = useState();

	const {
		isWeb3Enabled,
		Moralis,
		isWeb3EnableLoading,
		enableWeb3,
		web3,
		user,
	} = useMoralis();
	const winSize = useWindowSize();
	// Proxy address, Privatekey, Signature
	const proxyAccount = useMemo(() => {
		if (isWeb3Enabled) {
			window.web3 = web3;
			let proxyAccount;
			if (localStorage.getItem("proxyPrivKey")) {
				const privKey = localStorage.getItem("proxyPrivKey");
				proxyAccount = web3.eth.accounts.privateKeyToAccount(privKey);
			} else {
				proxyAccount = web3.eth.accounts.create();

				localStorage.setItem("proxyPrivKey", proxyAccount.privateKey);
			}

			return {
				address: proxyAccount.address,
				privateKey: proxyAccount.privateKey,
				sign: proxyAccount.sign,
			};
		}
	}, [isWeb3Enabled, web3.eth.accounts]);

	const signGameAndProxy = (challengeIdHex) => {
		const data = web3.utils.soliditySha3(
			web3.eth.abi.encodeParameters(
				["uint256", "address"],
				[challengeIdHex, proxyAccount.address]
			)
		);

		return web3.eth.personal.sign(data, user.get("ethAddress"));
	};

	const {
		fetch: getChallenge,
		data: challenge,
		// error: challengeError,
		// isLoading: isGettingChallenge,
	} = useMoralisCloudFunction(
		"getChallenge",
		{
			gamePreferences: pairingParams,
		},
		{ autoFetch: false }
	);

	const {
		fetch: fetchGame,
		data: gameData,
		// error: gameError,
		isLoading: isGameLoading,
	} = useMoralisQuery(
		"Game",
		(query) => gameId && query.get(gameId),
		[gameId],
		{
			autoFetch: false,
			// live: true,
		}
	);

	useEffect(() => {
		getChallenge();
	}, []);

	const initLiveChess = async () => {
		await getChallenge();
		if (challenge) {
			const challengeIdHex = idToHex(challenge.objectId);
			const signature = await signGameAndProxy(challengeIdHex);

			const gameId = await Moralis.Cloud.run("acceptChallenge", {
				challengeIdHex: challengeIdHex,
				proxyAddress: proxyAccount?.address,
				signature,
			});
			console.log(gameId);
		}
	};

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

				<GameBoard
					user={user}
					boardWidth={Math.min(winSize.width * 0.45, winSize.height * 0.7)}
				/>

				<div className="players self">
					<div className="player-info">
						<div className="username">
							{user?.attributes?.ethAddress.slice(0, 8)}...
							{user?.attributes?.ethAddress.slice(-9, -1)}
						</div>
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
					<button onClick={() => initLiveChess()}>Play Again</button>
					<button>Button2</button>
					<button>Button3</button>
					<button className="danger">Button4</button>
				</div>
			</section>
			{/* <Game user={user} isGameLoading={isGameLoading} gameData={gameData} /> */}
		</div>
	);
};

export default LiveChess;

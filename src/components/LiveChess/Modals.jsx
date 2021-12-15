import { Modal, Button } from "antd";
import { useHistory } from "react-router-dom";
import { useState, useContext } from "react";
import { useMoralisCloudFunction } from "react-moralis";
import { LiveChessContext } from "../../context/LiveChessContext";

const Modals = ({ joinLiveChess, setPairingParams }) => {
	const urlHistory = useHistory();
	const [isConfirmVisible, setIsConfirmVisible] = useState(false);
	const { liveGameAttributes, userSide, game, gameId, liveChallengeData } =
		useContext(LiveChessContext);

	const {
		fetch: cancelChallenge,
		data: cancelData,
		// error: challengeError,
		isLoading: cancelingChallenge,
	} = useMoralisCloudFunction(
		"cancelChallenge",
		{},
		{
			autoFetch: false,
		}
	);
	const {
		data: claimData,
		// error: gameError,
		fetch: claimVictory,
		isLoading: isClaimingPrize,
	} = useMoralisCloudFunction(
		"claimVictory",
		{ gameId: gameId, needNFT: false },
		{ autoFetch: false }
	);
	const {
		data: claimDataWithNFT,
		// error: gameError,
		fetch: claimVictoryWithNFT,
		isLoading: isClaimingPrizeWithNFT,
	} = useMoralisCloudFunction(
		"claimVictory",
		{ gameId: gameId, needNFT: true },
		{ autoFetch: false }
	);

	const handleQuickMatch = () => {
		setPairingParams({
			lowerElo: 100,
			upperElo: 100,
		});
		joinLiveChess();
	};

	// useEffect(()=>{
	// 	console.log(claimData)

	// },[claimData])

	return (
		<>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 0}
				footer={
					<Button
						key="Pairing"
						onClick={() => {
							cancelChallenge();
							urlHistory.push("/lobby");
						}}>
						Cancel Challenge
					</Button>
				}
				closable={false}>
				<h2>🔍 Finding you a match...</h2>
			</Modal>
			<Modal
				title="Waiting"
				visible={liveChallengeData?.get("challengeStatus") === 1}
				footer={null}
				closable={false}>
				<h2>Match Found. Waiting for Opponent 🎠 ...</h2>
			</Modal>
			<Modal
				title="Transfering Funds"
				visible={isClaimingPrize}
				okText="Go to Lobby"
				onOk={() => {
					setIsConfirmVisible(false);
					urlHistory.push("/lobby");
				}}
				closable={false}>
				<h2>
					Congrats! Your Prize Pool is being processed. Tansfer will happeen
					soon! 💸
				</h2>
				<p>This process will take complete under 10 seconds</p>
			</Modal>
			<Modal
				title="Minting"
				visible={isConfirmVisible}
				okText="Go to Lobby"
				onOk={() => {
					setIsConfirmVisible(false);
					urlHistory.push("/lobby");
				}}
				closable={false}>
				<h2>
					Congrats! Your Prize Pool is being processed 💸 and your NFT is on its
					way. Tansfer will happeen soon! 🖼️
				</h2>
				<p>This process will take complete under 15 seconds</p>
			</Modal>
			<Modal
				title="Failed"
				visible={liveChallengeData?.get("challengeStatus") === 9}
				footer={[
					((
						<Button key="toLobby" onClick={() => urlHistory.push("/lobby")}>
							Back to Lobby
						</Button>
					),
					(
						<button onClick={handleQuickMatch} type="primary">
							Try again
						</button>
					)),
				]}
				closable={false}>
				<h2>Search for a Match Failed 🟥 ! Please try again.</h2>
			</Modal>
			<Modal
				title="Canceling"
				visible={cancelingChallenge}
				footer={null}
				closable={false}>
				<h2>Canceling this Challenge 🔴 ...</h2>
			</Modal>
			{liveGameAttributes && (
				<>
					<Modal
						title="Victory"
						visible={
							(liveGameAttributes?.outcome === 3 && userSide === "w") ||
							(liveGameAttributes?.outcome === 4 && userSide === "b")
						}
						footer={[
							<Button
								key="only Stake"
								onClick={() => {
									claimVictory();
									setIsConfirmVisible(true);
								}}>
								Claim Pool
							</Button>,
							<Button
								key="with NFT"
								type="primary"
								onClick={() => {
									claimVictoryWithNFT();
									setIsConfirmVisible(true);
								}}>
								Claim Pool + Mint NFT
							</Button>,
						]}
						width={450}>
						<h1>🎊 You Won the Game 🎊</h1>
						<h3>{liveGameAttributes?.outcome === 3 ? "1 - 0" : "0 - 1"}</h3>
					</Modal>
					<Modal
						title="Defeat"
						visible={
							(liveGameAttributes?.outcome === 3 && userSide === "b") ||
							(liveGameAttributes?.outcome === 4 && userSide === "w")
						}
						footer={[
							<Button key="toLobby" onClick={() => urlHistory.push("/lobby")}>
								Back to Lobby
							</Button>,
							<Button
								key="quickMatch"
								type="primary"
								onClick={handleQuickMatch}>
								Quick Match
							</Button>,
						]}
						width={450}>
						<h1>🫂 You Lost the Game 🫂</h1>
						<h3>{liveGameAttributes?.outcome === 3 ? "1 - 0" : "0 - 1"}</h3>
					</Modal>
					<Modal
						title="Draw"
						visible={liveGameAttributes?.outcome === 2}
						footer={[
							<Button key="toLobby" onClick={() => urlHistory.push("/lobby")}>
								Back to Lobby
							</Button>,
							<Button
								key="quickMatch"
								type="primary"
								onClick={handleQuickMatch}>
								Quick Match
							</Button>,
						]}
						width={450}>
						<h1>Game Drawn 😅</h1>
						<h3>1/2 - 1/2</h3>
					</Modal>
				</>
			)}
		</>
	);
};
export default Modals;

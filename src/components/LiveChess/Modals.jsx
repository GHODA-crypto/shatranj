import { Modal, Button } from "antd";
import { useHistory } from "react-router-dom";

const Modals = ({
	game,
	liveGameAttributes,
	isPlayerWhite,
	liveChallengeData,
	setNeedNFT,
	joinLiveChess,
	setPairingParams,
	cancelChallenge,
	cancelingChallenge,
}) => {
	const urlHistory = useHistory();

	const handleClaimPool = () => {
		setNeedNFT(false);
	};
	const handleClaimPoolAndNFT = () => {
		setNeedNFT(true);
	};
	const handleQuickMatch = () => {
		setPairingParams({
			lowerElo: 100,
			upperElo: 100,
			preferedSide: "w",
		});
		joinLiveChess();
	};

	return (
		<>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 0}
				footer={
					<Button key="only Stake" onClick={cancelChallenge}>
						Cancel Challenge
					</Button>
				}
				closable={false}>
				<h2>🔍 Finding you a match...</h2>
			</Modal>
			<Modal
				title="Loading"
				visible={liveChallengeData?.get("challengeStatus") === 1}
				footer={null}
				closable={false}>
				<h2>Match Found. Waiting for Opponent 🎠 ...</h2>
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
			<Modal
				title="Victory"
				visible={
					game.game_over() &&
					((liveGameAttributes?.outcome === 3 && isPlayerWhite) ||
						(liveGameAttributes?.outcome === 4 && !isPlayerWhite))
				}
				footer={[
					<Button key="only Stake" onClick={handleClaimPool}>
						Claim Pool
					</Button>,
					<Button key="with NFT" type="primary" onClick={handleClaimPoolAndNFT}>
						Claim Pool + Mint NFT
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 25}>
				<h1>🎊 You Won the Game 🎊</h1>
				<h3>{liveGameAttributes?.outcome === 3 ? "1 - 0" : "0 - 1"}</h3>
			</Modal>
			<Modal
				title="Defeat"
				visible={
					(game.game_over() &&
						!(
							(liveGameAttributes?.outcome === 3 && isPlayerWhite) ||
							(liveGameAttributes?.outcome === 4 && !isPlayerWhite)
						)) ||
					liveChallengeData?.get("challengeStatus") === 3
				}
				footer={[
					<Button key="toLobby" onClick={() => urlHistory.push("/lobby")}>
						Back to Lobby
					</Button>,
					<Button key="quickMatch" type="primary" onClick={handleQuickMatch}>
						Quick Match
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 25}>
				<h1>🫂 You Lost the Game 🫂</h1>
				<h3>{liveGameAttributes?.outcome === 3 ? "1 - 0" : "0 - 1"}</h3>
			</Modal>
			<Modal
				title="Loading"
				visible={game.game_over() && !liveGameAttributes?.outcome === 2}
				footer={[
					<Button key="quickMatch" type="primary" onClick={handleQuickMatch}>
						Quick Match
					</Button>,
				]}
				width={window.getComputedStyle(document.body).fontSize * 25}>
				<h1>Game Drawn 😅</h1>
				<h3>1/2 - 1/2</h3>
			</Modal>
		</>
	);
};
export default Modals;

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Elo is Ownable {
	mapping(address => uint256) private elo;

	address private _masterContract;

	modifier onlyMaster() {
		require(_masterContract == msg.sender, "Function only for Core contract!");
		_;
	}

	function changeMaster(address _newMaster) external onlyOwner {
		_masterContract = _newMaster;
	}

	function getElo(address _player) public view returns (uint256) {
		if (elo[_player] == 0) return 700;
		else return elo[_player];
	}

	function setElo(address _player, uint256 _elo) public onlyMaster {
		if (_elo > 100) elo[_player] = _elo;
	}

	function recordResult(
		address player1,
		address player2,
		uint8 outcome
	) external onlyMaster {
		// Get current scores
		uint256 scoreA = getElo(player1);
		uint256 scoreB = getElo(player2);

		// Calculate result for player A
		int256 resultA = 1; // 0 = lose, 1 = draw, 2 = win
		if (outcome == 2) {
			resultA = 2;
		} else if (outcome == 3) {
			resultA = 0;
		}

		// Calculate new score
		(int256 changeA, int256 changeB) = getScoreChange(
			int256(scoreA) - int256(scoreB),
			resultA
		);
		setElo(player1, uint256(int256(scoreA) + changeA));
		setElo(player2, uint256(int256(scoreB) + changeB));
	}

	function getScoreChange(int256 difference, int256 resultA)
		public
		pure
		returns (int256, int256)
	{
		bool reverse = (difference > 0); // note if difference was positive
		uint256 diff = abs(difference); // take absolute to lookup in positive table
		// Score change lookup table
		int256 scoreChange = 10;
		if (diff > 636) scoreChange = 20;
		else if (diff > 436) scoreChange = 19;
		else if (diff > 338) scoreChange = 18;
		else if (diff > 269) scoreChange = 17;
		else if (diff > 214) scoreChange = 16;
		else if (diff > 168) scoreChange = 15;
		else if (diff > 126) scoreChange = 14;
		else if (diff > 88) scoreChange = 13;
		else if (diff > 52) scoreChange = 12;
		else if (diff > 17) scoreChange = 11;
		// Depending on result (win/draw/lose), calculate score changes
		if (resultA == 2) {
			return (
				(reverse ? 20 - scoreChange : scoreChange),
				(reverse ? -(20 - scoreChange) : -scoreChange)
			);
		} else if (resultA == 1) {
			return (
				(reverse ? 10 - scoreChange : scoreChange - 10),
				(reverse ? -(10 - scoreChange) : -(scoreChange - 10))
			);
		} else {
			return (
				(reverse ? scoreChange - 20 : -scoreChange),
				(reverse ? -(scoreChange - 20) : scoreChange)
			);
		}
	}

	function abs(int256 value) public pure returns (uint256) {
		if (value >= 0) return uint256(value);
		else return uint256(-1 * value);
	}
}

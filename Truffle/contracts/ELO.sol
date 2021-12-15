//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Elo is Ownable {
	mapping(address => uint256) private elo;

	address private _masterContract;

	event EloChanged(address indexed player, uint256 newElo);

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
		if (_elo > 100) {
			elo[_player] = _elo;
			emit EloChanged(_player, _elo);
		}
	}

	function recordResult(
		address player1,
		address player2,
		uint8 outcome
	) external onlyMaster returns (uint256, uint256) {
		// Get current scores
		uint256 scoreA = getElo(player1);
		uint256 scoreB = getElo(player2);

		// Calculate new score
		int256 change = getScoreChange(int256(scoreA) - int256(scoreB), outcome);
		uint256 eloA = uint256(int256(scoreA) + change);
		uint256 eloB = uint256(int256(scoreB) - change);
		setElo(player1, eloA);
		setElo(player2, eloB);
		return ((eloA > 100 ? eloA : 100), (eloB > 100 ? eloB : 100));
	}

	function getScoreChange(int256 difference, uint256 outcome)
		public
		pure
		returns (int256)
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
		if (outcome == 3) {
			return (reverse ? 20 - scoreChange : scoreChange);
		} else if (outcome == 4) {
			return (reverse ? -scoreChange : scoreChange - 20);
		} else {
			return (reverse ? 10 - scoreChange : scoreChange - 10);
		}
	}

	function abs(int256 value) public pure returns (uint256) {
		if (value >= 0) return uint256(value);
		else return uint256(-1 * value);
	}
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

interface IElo {
	function getElo(address _player) external view returns (uint256);

	function recordResult(
		address player1,
		address player2,
		uint8 outcome
	) external returns (uint256, uint256);
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

interface IChessNFT {
	function mint(
		address account,
		uint256 id,
		uint256 amount,
		bytes memory data
	) external;
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

interface IChessNFT {
	function mint(address _account, string calldata _ipfsHash)
		external
		returns (uint256);
}

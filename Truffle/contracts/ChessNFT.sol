//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChessNFT is ERC1155, Ownable {
	address private _masterContract;

	modifier onlyMaster() {
		require(_masterContract == msg.sender, "Function only for Core contract!");
		_;
	}

	function changeMaster(address newMaster) public onlyOwner {
		_masterContract = newMaster;
	}

	constructor() ERC1155("https://ghoda.cypto") {}

	function setURI(string memory newuri) public onlyOwner {
		_setURI(newuri);
	}

	function mint(
		address account,
		uint256 id,
		uint256 amount,
		bytes memory data
	) external onlyMaster {
		_mint(account, id, amount, data);
	}

	function mintBatch(
		address to,
		uint256[] memory ids,
		uint256[] memory amounts,
		bytes memory data
	) public onlyOwner {
		_mintBatch(to, ids, amounts, data);
	}
}

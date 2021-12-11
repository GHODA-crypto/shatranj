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

	mapping(uint256 => string) private ipfsHashes;
	string private uriPrefix;
	string private uriSuffix;
	uint256 idCounter;

	constructor(string memory _prefix, string memory _suffix) ERC1155("") {
		uriPrefix = _prefix;
		uriSuffix = _suffix;
		idCounter = 1;
	}

	function setURI(string memory newuri) public onlyOwner {
		_setURI(newuri);
	}

	function setPrefixSuffix(string calldata _prefix, string calldata _suffix)
		public
		onlyOwner
	{
		uriPrefix = _prefix;
		uriSuffix = _suffix;
	}

	function uri(uint256 _tokenId) public view override returns (string memory) {
		return string(abi.encodePacked(uriPrefix, ipfsHashes[_tokenId], uriSuffix));
	}

	function mint(address _account, string calldata _ipfsHash)
		external
		onlyMaster
		returns (uint256)
	{
		uint256 id = idCounter;
		_mint(_account, id, 1, "");
		ipfsHashes[id] = _ipfsHash;
		idCounter = id + 1;
		return id;
	}
}

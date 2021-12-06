//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

contract ChessGame {
    IERC20 public chessToken;
    IERC1155 public chessNFT;

    constructor(address chessTokenAddress, address chessNFTAddress) {
        chessToken = IERC20(chessTokenAddress);
        chessNFT = IERC1155(chessNFTAddress);
    }

    // function createGame
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.2;

interface IChessLogic {
	struct Board {
		uint256 gameState;
		uint32 playerState;
		uint32 opponentState;
		bool turnBlack;
	}

	function checkGameFromStart(uint16[] memory moves)
		external
		pure
		returns (
			uint8,
			uint256,
			uint32,
			uint32
		);

	function checkGame(
		uint256 startingGameState,
		uint32 startingPlayerState,
		uint32 startingOpponentState,
		bool startingTurnBlack,
		uint16[] memory moves
	)
		external
		pure
		returns (
			uint8 outcome,
			uint256 gameState,
			uint32 playerState,
			uint32 opponentState
		);

	function verifyGame(Board memory _board, uint16 _move)
		external
		pure
		returns (uint8, Board memory);
}

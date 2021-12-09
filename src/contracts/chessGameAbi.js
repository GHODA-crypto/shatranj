export const abi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_chessToken",
				type: "address",
			},
			{
				internalType: "address",
				name: "_chessNFT",
				type: "address",
			},
			{
				internalType: "address",
				name: "_chessLogic",
				type: "address",
			},
			{
				internalType: "address",
				name: "_elo",
				type: "address",
			},
			{
				internalType: "address",
				name: "serverAddress",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "gameId",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "address",
				name: "white",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "black",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint8",
				name: "outcome",
				type: "uint8",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "eloW",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "eloB",
				type: "uint256",
			},
		],
		name: "GameEnded",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "gameId",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "address",
				name: "white",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "black",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "whiteProxy",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "blackProxy",
				type: "address",
			},
		],
		name: "GameStarted",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "player",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "StakedBalance",
		type: "event",
	},
	{
		inputs: [],
		name: "chessLogic",
		outputs: [
			{
				internalType: "contract IChessLogic",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "chessNFT",
		outputs: [
			{
				internalType: "contract IChessNFT",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "chessToken",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "elo",
		outputs: [
			{
				internalType: "contract IElo",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "stakedBalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newMaster",
				type: "address",
			},
		],
		name: "changeServer",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "getBetAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_bet",
				type: "uint256",
			},
		],
		name: "changeBet",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_fee",
				type: "uint256",
			},
		],
		name: "changeFee",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_fee",
				type: "uint256",
			},
		],
		name: "changeNFTFee",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_player",
				type: "address",
			},
		],
		name: "getStakedBalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
		],
		name: "stake",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
		],
		name: "unstake",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_gameId",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_white",
				type: "address",
			},
			{
				internalType: "address",
				name: "_whiteProxy",
				type: "address",
			},
			{
				internalType: "bytes",
				name: "_whiteSig",
				type: "bytes",
			},
			{
				internalType: "address",
				name: "_black",
				type: "address",
			},
			{
				internalType: "address",
				name: "_blackProxy",
				type: "address",
			},
			{
				internalType: "bytes",
				name: "_blackSig",
				type: "bytes",
			},
		],
		name: "StartGame",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_gameId",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "_gameState",
				type: "uint256",
			},
			{
				internalType: "uint32",
				name: "_whiteState",
				type: "uint32",
			},
			{
				internalType: "uint32",
				name: "_blackState",
				type: "uint32",
			},
			{
				internalType: "uint8",
				name: "_outcome",
				type: "uint8",
			},
			{
				internalType: "bytes32",
				name: "_ipfsHash",
				type: "bytes32",
			},
		],
		name: "endGameForce",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_gameId",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "_gameState",
				type: "uint256",
			},
			{
				internalType: "uint32",
				name: "_whiteState",
				type: "uint32",
			},
			{
				internalType: "uint32",
				name: "_blackState",
				type: "uint32",
			},
			{
				internalType: "uint16",
				name: "_move",
				type: "uint16",
			},
			{
				internalType: "bytes",
				name: "_signature",
				type: "bytes",
			},
			{
				internalType: "bytes32",
				name: "_ipfsHash",
				type: "bytes32",
			},
		],
		name: "endGame",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

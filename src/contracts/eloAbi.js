export const eloAbi = [
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
				name: "newElo",
				type: "uint256",
			},
		],
		name: "EloChanged",
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
		inputs: [{ internalType: "int256", name: "value", type: "int256" }],
		name: "abs",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "_newMaster", type: "address" }],
		name: "changeMaster",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "_player", type: "address" }],
		name: "getElo",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "int256", name: "difference", type: "int256" },
			{ internalType: "uint256", name: "outcome", type: "uint256" },
		],
		name: "getScoreChange",
		outputs: [{ internalType: "int256", name: "", type: "int256" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "player1", type: "address" },
			{ internalType: "address", name: "player2", type: "address" },
			{ internalType: "uint8", name: "outcome", type: "uint8" },
		],
		name: "recordResult",
		outputs: [
			{ internalType: "uint256", name: "", type: "uint256" },
			{ internalType: "uint256", name: "", type: "uint256" },
		],
		stateMutability: "nonpayable",
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
			{ internalType: "address", name: "_player", type: "address" },
			{ internalType: "uint256", name: "_elo", type: "uint256" },
		],
		name: "setElo",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

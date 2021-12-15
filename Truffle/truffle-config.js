require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
//
// const fs = require("fs");
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
	// Uncommenting the defaults below
	// provides for an easier quick-start with Ganache.
	// You can also follow this format for other networks;
	// see <http://truffleframework.com/docs/advanced/configuration>
	// for more details on how to specify configuration options!
	//
	networks: {
		develop: {
			host: "127.0.0.1",
			port: 7545,
			chainId: 1337,
			network_id: 1337,
			deploymentPollingInterval: 10,
		},
		mumbai: {
			provider: () =>
				new HDWalletProvider(
					process.env.PRIVATE_KEY,
					`https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`
				),
			network_id: 80001, // Ropsten's id
			gas: 6000000,
			gasPrice: 10000000000,
			// gas: 29999972, // Ropsten has a lower block limit than mainnet
			confirmations: 2, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
	},
	//
	// Truffle DB is currently disabled by default; to enable it, change enabled:
	// false to enabled: true. The default storage location can also be
	// overridden by specifying the adapter settings, as shown in the commented code below.
	//
	// NOTE: It is not possible to migrate your contracts to truffle DB and you should
	// make a backup of your artifacts to a safe location before enabling this feature.
	//
	// After you backed up your artifacts you can utilize db by running migrate as follows:
	// $ truffle migrate --reset --compile-all
	//
	compilers: {
		solc: {
			version: "0.8.10", // Fetch exact version from solc-bin (default: truffle's version)
			// docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 1000000,
				},
				//  evmVersion: "byzantium"
			},
		},
	},
	plugins: ["truffle-plugin-verify"],
	api_keys: {
		etherscan: process.env.ETHERSCAN_API_KEY,
	},
	// db: {
	//   enabled: true,
	//   host: "127.0.0.1",
	//   adapter: {
	//     name: "sqlite",
	//     settings: {
	//       directory: ".db",
	//     },
	//   },
	// },
};

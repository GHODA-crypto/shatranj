const { spawn } = require("child_process");

const run = () => {
	console.log("🚀 Starting local dev chain...");
	try {
		spawn("ganache-cli -d --db data -i 1337 --port 8545", {
			shell: true,
			stdio: "inherit",
		});
	} catch (e) {
		console.log(e);
	}
};
run();

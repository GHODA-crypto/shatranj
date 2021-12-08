var crypto = require("crypto");
var hash = crypto.createHash("sha256").update("hello").digest("hex");
console.log(parseInt(BigInt("0x" + hash) % BigInt(10000000000)));

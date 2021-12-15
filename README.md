# `Shatranj`

Deployed at : https://shatranj.ga/

Submission Link : [Devfolio](https://devfolio.co/submissions/shatranj-d063)

## HODL Your Horses

Shatranj is a one of its kind chess dapp. Users can stake their `GHODA` tokens and get `sGHODA` in return. The `sGHODA` token is used for prize pool and rewarding mechanisms.

Players connect their wallet. Claim a few `GHODA` tokens from the faucet and stake them.

Join the challenge pool for a quick match or create challenges for their friends. The winner will be automatically rewarded without signing a single transaction.
Winners get to choose between

- Claiming the whole pool `(Staked Tokens x2 - Fees)`

OR

- Claim the pool `(Staked Tokens x2 - Fees - NFT Fees)` and get rewarded with an NFT.

These NFTs are depiction of all the sacrifices made by the players and records the game as a colourful story in a PNG. These NFTs are available on OpenSea and an in-app marketplace to sell and trade.

**Each NFT provides the users with a chance to claim a special piece skin. This skin can be used in-game to customise the pieces.**

![nft.png](/assets/nft.png)

## How to play

1. Login to your wallet using the authenticate button
2. Test tokens will be automatically transferred to your wallet
3. Stake the GHODA tokens to convert them into sGHODA tokens
4. Join quick match with along with a friend
5. Play.
6. Claim your prize.
7. Wait for some time for the NFTs to appear on the page. (IPFS takes some time to load the data)

https://user-images.githubusercontent.com/54071350/146597796-cdc7fc32-150b-42e6-bd89-88dece1cd20a.mp4

---

## Geek Stuff Ahead

There are 4 contracts who govern the ownership of the games played.

1. `Master` - Holds the power to govern all the other contracts and lock or unlock `sGHODA` (staked `GHODA`)
2. `ERC1155` - NFT
3. `ERC20` - `GHODA` Token
4. `ELO` - Manages player ratings on-chain.

The game is built with Moralis as a Cloud provider. There are cloud functions for

- Verifying each move sent by the user.
- Joining the challenge pool.
- Resigning, claiming victory.
- Creating custom challenges to send friends/competitors.

The game states are observed and stored on Moralis to track wins. The winners can claim their prize pool or demand an NFT, too. Claiming party would invoke a function that triggers the Oracle deployed on StackOS. This Oracle now invokes smart contract functions to end the game.

The smart contracts are air tight against replay attacks.

Only whitelisted oracles can submit the transactions. This limitation can and will be removed as soon as Web3 can support a fully decentralised cloud with privacy and security.

ChessGame: https://mumbai.polygonscan.com/address/0x645c7dA2A42281A4F5D656b1872C1BAbfa7FD85A#code
ELO Rating: https://mumbai.polygonscan.com/address/0xdb3266656a85c124a158b119c047673a454Ea001#code
ERC20 Token: https://mumbai.polygonscan.com/address/0x5537986AEC0e7AF4643308c0479fB0Aaec2A227e#code
ERC1155 NFT: https://mumbai.polygonscan.com/address/0x8d88dC0fF21b5da42700dfF59D881056D02B17B6#code

---

## Challenges, Ideas and Sacrifices

Web3 is about owning the facts. The fact that you won, or that you are indeed the person who won and should get the staked tokens.

Chess dApp sounds an easy task to pull off. Here are some of the ideas we came up with. The check box denotes if we iterated over the idea.

### ⭕. Going home broke.

- Create a chess validator contract on chain and send transactions for each move and create logic for the winner
  to claim the pool.
- Not very efficient with the gas fee going through the roof.

### ⭕. Bad UX.

- Create a chess validator contract that only verifies the game after it has been played. To do so, we would need every every move signed by the user.
- This idea is good with the gas but is not a good UX since signing messages require to sign the pop-up.

### ✅. Ahead of its Time

- Create a client that generates random proxy accounts for users which can be used to sign the messages without a popup using `web3.accounts.sign`.
- These proxies would be submitted to the smart contract for a game session by a centralised oracle and now, both players can send and verify the moves on the client (off-chain). The moves and board state will be sent to the smart contract at the end of the game by the player who wants to claim the victory. Keeping in mind the noonces to stop replay attacks.
- Now, we do remove the trust factors between both players, but there needs to be dispute resolution methods on the smart contract. The disputes would be very difficult to track on-chain, where real-world time is disregarded.
- We were successful in coding the smart contracts for verification of the game on-chain (without a lot of gas).
- But this method still relies on a centralised oracle that would submit the proxies to the contract. Hence, we had to let go of this idea until web3 matures enough to support decentralised cloud computation.

### ✅. Beats us to it.

> "... part of the ethos of web 3 is the idea of users being rewarded for the value that they bring to applications ..."

> "... while our users care about blockchain technology they are focused on the benefits it can bring, rather than decentralizing too many features." - Axie Infinity Whitepaper

- Now, we host cloud functions on Moralis which provides a tamper proof Web2-3 solution for crypto-login and auth methods. With Moralis handling the authentication burden, we can now focus on bringing back the ownership to the users.
- We now use Moralis to trigger a centralised Oracle (Temporary solution) that calls the smart contract functions.
- Stakes are locked, game is played off-chain and on the Cloud. Then submitted to the Oracle which generates NFTs and mints them if the user wants it. Oracle submits the game to the distributed ledger and now the user owns their game. On-chain and off-chain.
- The NFTs are minted on the oracle and not the client because clients can mint spoofs and there is no way to verify the NFTs without saving gas. Hence we mint them using set protocols and ensure that only correct NFTs are minted.

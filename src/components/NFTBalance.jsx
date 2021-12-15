import React, { useState, useEffect } from "react";
import {
	useMoralis,
	useNFTBalances,
	useMoralisCloudFunction,
	useMoralisQuery,
} from "react-moralis";
import { Card, Image, Tooltip, Modal, Input, Skeleton } from "antd";
import {
	FileSearchOutlined,
	SendOutlined,
	ShoppingCartOutlined,
	SkinOutlined,
} from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";
import AddressInput from "./AddressInput";
import { NFT_TOKEN_ADDRESS } from "../contracts/address";
const { Meta } = Card;

const styles = {
	NFTs: {
		display: "flex",
		flexWrap: "wrap",
		WebkitBoxPack: "start",
		justifyContent: "flex-start",
		margin: "2rem auto 0",
		maxWidth: "1000px",
		width: "100%",
		gap: "10px",
	},
};

function NFTBalance() {
	const { data: NFTBalances } = useNFTBalances();
	const { Moralis, chainId } = useMoralis();
	const [visible, setVisibility] = useState(false);
	const [receiverToSend, setReceiver] = useState(null);
	const [nftToSend, setNftToSend] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const [isNFTMetaModalVisible, setIsNFTMetaModalVisible] = useState(false);
	const [selectedNFT, setSelectedNFT] = useState(null);

	// window.nft = NFTBalances;

	async function transfer(nft, receiver) {
		const options = {
			type: nft.contract_type.toLowerCase(),
			tokenId: nft.token_id,
			receiver: receiver,
			contractAddress: nft.token_address,
			amount: 1,
		};
		// console.log(options);

		setIsPending(true);
		await Moralis.transfer(options)
			.then((tx) => {
				console.log(tx);
				setIsPending(false);
			})
			.catch((e) => {
				alert(e.message);
				setIsPending(false);
			});
	}

	const handleTransferClick = (nft) => {
		setNftToSend(nft);
		setVisibility(true);
	};

	return (
		<>
			<div style={styles.NFTs}>
				<Skeleton loading={!NFTBalances?.result}>
					{!NFTBalances?.result ? (
						<h1>No NFTs found</h1>
					) : (
						NFTBalances.result.map((nft, index) =>
							nft.token_address.toLowerCase() !== NFT_TOKEN_ADDRESS ? null : (
								<Card
									hoverable
									// loading
									actions={[
										<Tooltip title="View On Blockexplorer">
											<FileSearchOutlined
												onClick={() => {
													window.open(
														`${getExplorer(chainId)}address/${
															nft.token_address
														}`,
														"_blank"
													);

													// console.log(nft.metadata.image);
												}}
											/>
										</Tooltip>,
										<Tooltip title="Transfer NFT">
											<SendOutlined onClick={() => handleTransferClick(nft)} />
										</Tooltip>,
										<Tooltip title="Sell On OpenSea">
											<ShoppingCartOutlined
												onClick={() =>
													window
														.open(
															`https://testnets.opensea.io/assets/mumbai/${nft.token_address}/${nft.token_id}/sell`,
															"_blank"
														)
														.focus()
												}
											/>
										</Tooltip>,

										<Tooltip title="Use as Piece Skin">
											<SkinOutlined
												onClick={() => {
													setSelectedNFT(nft);
													setIsNFTMetaModalVisible(true);
												}}
											/>
										</Tooltip>,
									]}
									style={{
										width: 300,
										border: "2px solid #e7eaf3",
									}}
									cover={
										<Image
											preview={false}
											src={nft?.image || "error"}
											fallback="data:image/png;base64,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"
											alt=""
											style={{ height: "300px" }}
										/>
									}
									key={index}>
									<Meta
										title={nft.metadata.name}
										description={nft.token_address}
									/>
								</Card>
							)
						)
					)}
				</Skeleton>
			</div>
			<Modal
				title={`Transfer ${nftToSend?.name || "NFT"}`}
				visible={visible}
				onCancel={() => setVisibility(false)}
				onOk={() => transfer(nftToSend, receiverToSend)}
				confirmLoading={isPending}
				okText="Send">
				<AddressInput autoFocus placeholder="Receiver" onChange={setReceiver} />
			</Modal>
			{isNFTMetaModalVisible && (
				<NFTMetaModal
					isNFTMetaModalVisible={isNFTMetaModalVisible}
					setIsNFTMetaModalVisible={setIsNFTMetaModalVisible}
					nft={selectedNFT}
				/>
			)}
		</>
	);
}

const NFTMetaModal = ({
	isNFTMetaModalVisible,
	setIsNFTMetaModalVisible,
	nft,
}) => {
	const { user, isWeb3Enabled } = useMoralis();

	const mintedAt = new Date(nft.metadata.minted_at);
	const image = nft.metadata.image.split("/");
	const piece = nft.metadata.piece.split("/");

	const imageHash = image[image.length - 2];
	const imageName = image[image.length - 1];
	const pieceHash = piece[piece.length - 2];
	const pieceName = piece[piece.length - 1];

	const {
		fetch: callUsePieceSkin,
		data: isPieceSkinSet,
		error: pieceSkinError,
		isLoading: settingPieceSkin,
	} = useMoralisCloudFunction(
		"usePieceSkin",
		{
			token_uri: nft.token_uri,
		},
		{
			autoFetch: false,
		}
	);

	const {
		data: [SkinData],
		// error: gameError,
		isLoading: isSkinDataLoading,
	} = useMoralisQuery(
		"GameSkin",
		(query) => query.equalTo("userEthAddress", user?.get("ethAddress")),
		[user, isWeb3Enabled],
		{
			autoFetch: true,
			live: true,
		}
	);

	const {
		fetch: removePieceSkin,
		data: isPieceSkinRemoved,
		isLoading: removingPieceSkin,
	} = useMoralisCloudFunction(
		"removePieceSkin",
		{
			token_uri: nft.token_uri,
		},
		{
			autoFetch: false,
		}
	);

	useEffect(() => {
		if (isPieceSkinSet) {
			console.log(isPieceSkinSet);
			setIsNFTMetaModalVisible(false);
			isPieceSkinSet ? success() : fail();
		}
	}, [isPieceSkinSet]);

	const formatAMPM = () => {
		let hours = mintedAt.getHours();
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12;
		const strTime = hours + ampm;
		return strTime;
	};

	const success = () => {
		Modal.success({ content: "Successfully set piece skin" });
	};

	const fail = () => {
		Modal.error({ content: "Something went wrong. Try Again." });
	};

	return (
		<>
			<Modal
				visible={isNFTMetaModalVisible}
				okText="Use this NFT as Piece Skin"
				onCancel={() => {
					setIsNFTMetaModalVisible(false);
				}}
				onOk={() => {
					callUsePieceSkin();
				}}
				confirmLoading={settingPieceSkin}
				centered={true}
				title={nft.metadata.name}>
				<div className="images" style={{ display: "flex" }}>
					<img
						src={`https://ipfs.moralis.io:2053/ipfs/${imageHash}/${imageName}`}
						alt="NFT"
					/>
					<Image
						src={`https://ipfs.moralis.io:2053/ipfs/${pieceHash}/${pieceName}`}
						alt="PieceNFT"
					/>
				</div>
				<div className="info">
					<div className="name">{nft.metadata.name}</div>
					<div className="message">
						You Defeated{" "}
						<span className="white">{nft.metadata.attributes[0].value}</span> in{" "}
						<span className="moves">{nft.metadata.attributes[3].value}</span>{" "}
						moves.
					</div>
					<div className="datetime">
						This NFT was minted on{" "}
						<span className="date">{mintedAt.toDateString}</span> at{" "}
						<span className="time">{formatAMPM()}</span>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default NFTBalance;

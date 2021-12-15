import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSound from "use-sound";
import {
	useMoralis,
	useMoralisCloudFunction,
	useMoralisQuery,
} from "react-moralis";
import Confirmation from "../assets/chess_audio/Confirmation.mp3";
import SocialNotify from "../assets/chess_audio/SocialNotify.mp3";
import { ReactComponent as Knight } from "../assets/knight.svg";
import { Card, Image, Tooltip, Modal, Tabs, Skeleton } from "antd";
import {
	FileSearchOutlined,
	SendOutlined,
	GiftOutlined,
	SkinOutlined,
	CheckCircleOutlined,
	WarningOutlined,
} from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";
import AddressInput from "./AddressInput";
import { NFT_TOKEN_ADDRESS } from "../contracts/address";
const { Meta } = Card;
const { TabPane } = Tabs;

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
	const { Moralis, chainId, user, isWeb3Enabled } = useMoralis();
	const [visible, setVisibility] = useState(false);
	const [receiverToSend, setReceiver] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const [nftToSend, setNftToSend] = useState(null);

	// window.nft = NFTBalances;
	const {
		data: [skinData],
		error: skinError,
		isLoading: isSkinDataLoading,
	} = useMoralisQuery(
		"GameSkin",
		(query) => query.equalTo("userAddress", user?.get("ethAddress")).limit(1),
		[user, isWeb3Enabled],
		{
			autoFetch: true,
			live: true,
		}
	);
	const {
		data: userNFTs,
		error: userNFTError,
		isLoading: isLoadingUserNFTs,
	} = useMoralisQuery(
		"PolygonNFTOwners",
		(query) =>
			query
				.equalTo("owner_of", user?.get("ethAddress"))
				.equalTo("token_address", NFT_TOKEN_ADDRESS),
		[user, isWeb3Enabled],
		{
			autoFetch: true,
			live: true,
		}
	);

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

	return (
		<>
			<Tabs
				defaultActiveKey="1"
				type="card"
				style={{ marginTop: 40, width: "100%", maxWidth: 1000 }}>
				<TabPane key="1" tab="Your NFTs">
					<div style={styles.NFTs}>
						<Skeleton loading={isLoadingUserNFTs}>
							{userNFTs.map(({ attributes }, index) => (
								<NFTCard
									token_id={attributes.token_id}
									token_uri={attributes.token_uri}
									setNftToSend={setNftToSend}
									key={index}
									skinData={skinData}
									setVisibility={setVisibility}
								/>
							))}
							{!userNFTs && (
								<>
									<div
										style={{
											width: "100%",
											display: "flex",
											flexDirection: "column",
											justfyContent: "center",
											alignItems: "center",
										}}>
										<Knight style={{ width: 100, height: 100, opacity: 0.5 }} />
										<h1 style={{ fontSize: "2rem", marginTop: "-17.5rem" }}>
											No NFTs found
										</h1>
										<Link
											to="/lobby"
											style={{
												color: "#58c563",
												textDecoration: "none",
												fontSize: "1.2rem",
												cursor: "pointer",
												zIndex: 100,
											}}>
											Earn one here
										</Link>
									</div>
								</>
							)}
						</Skeleton>
					</div>
				</TabPane>
				<TabPane key="2" tab="Active Skins">
					{!skinData?.attributes ? (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								justfyContent: "center",
								alignItems: "center",
							}}>
							<Knight style={{ width: 100, opacity: 0.5 }} />
							<h1 style={{ fontSize: "2rem", marginTop: "-17.5rem" }}>
								No Skins in use
							</h1>
						</div>
					) : (
						<div style={styles.NFTs}>
							{Object.keys(skinData?.attributes)
								.filter((key) => key.length === 2)
								.map((pieceKey, index) => (
									<Card
										hoverable
										// loading
										actions={[
											<Tooltip title="View On OpenSea">
												<GiftOutlined
													onClick={() => {
														window
															.open(skinData.get(pieceKey), "_blank")
															.focus();
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
												src={skinData.get(pieceKey) || "error"}
												fallback="data:image/png;base64,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"
												alt=""
												style={{ height: "300px" }}
											/>
										}
										key={index}></Card>
								))}
						</div>
					)}
				</TabPane>
			</Tabs>

			<Modal
				title={`Transfer ${nftToSend?.name || "NFT"}`}
				visible={visible}
				onCancel={() => setVisibility(false)}
				onOk={() => transfer(nftToSend, receiverToSend)}
				confirmLoading={isPending}
				okText="Send">
				<AddressInput autoFocus placeholder="Receiver" onChange={setReceiver} />
			</Modal>
		</>
	);
}

const NFTMetaModal = ({
	isNFTMetaModalVisible,
	setIsNFTMetaModalVisible,
	metadata,
	token_uri,
}) => {
	const [playConfirmation] = useSound(Confirmation);

	const mintedAt = new Date(metadata?.minted_at);
	const image = metadata?.image.split("/");
	const piece = metadata?.piece.split("/");
	const {
		fetch: setPieceSkin,
		data: isPieceSkinSet,
		error: pieceSkinError,
		isLoading: settingPieceSkin,
	} = useMoralisCloudFunction(
		"usePieceSkin",
		{
			token_uri: token_uri,
		},
		{
			autoFetch: false,
		}
	);

	const {
		fetch: removePieceSkin,
		data: isPieceSkinRemoved,
		isLoading: removingPieceSkin,
	} = useMoralisCloudFunction(
		"removePieceSkin",
		{
			token_uri: token_uri,
		},
		{
			autoFetch: false,
		}
	);

	function success() {
		Modal.success({
			title: "The Skin is set successfully.",
		});
	}

	function fail() {
		Modal.error({
			title: "Something went wrong",
			content: "Please try again",
		});
	}

	useEffect(() => {
		if (isPieceSkinSet) {
			success();
		}
		if (pieceSkinError) {
			fail();
		}
	}, [isPieceSkinSet, pieceSkinError]);

	const formatAMPM = () => {
		let hours = mintedAt.getHours();
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12;
		const strTime = hours + ampm;
		return strTime;
	};

	const { confirm } = Modal;

	function showSetConfirm() {
		confirm({
			title: "Do you Want to set this NFT as Piece Skin?",
			icon: <CheckCircleOutlined />,
			content: "by clicking yes you will set this NFT as the piece skin",
			okText: "Yes",
			okType: "success",
			cancelText: "No",
			onOk: () => {
				setPieceSkin();
			},
			onCancel: () => {
				console.log("Cancel");
				setIsNFTMetaModalVisible(false);
			},
		});
	}
	function showDeleteConfirm() {
		confirm({
			title: "Do you Want to remove this NFT as Piece Skin?",
			icon: <WarningOutlined />,
			content: "by clicking yes you will remove this NFT as the piece skin",
			okText: "Yes",
			okType: "danger",
			cancelText: "No",
			onOk() {
				removePieceSkin();
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	}

	return (
		<>
			<Modal
				visible={isNFTMetaModalVisible}
				okText="Use this NFT as Piece Skin"
				onCancel={() => {
					setIsNFTMetaModalVisible(false);
				}}
				onOk={() => {
					setIsNFTMetaModalVisible(false);
					showSetConfirm();
					playConfirmation();
				}}
				width={450}
				confirmLoading={settingPieceSkin}
				centered={true}
				title={metadata.name}>
				<div
					className="images"
					style={{ display: "flex", justifyContent: "space-between" }}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "flex-end",
							marginRight: "0.5rem",
						}}>
						<div
							style={{
								fontSize: "0.75rem",
								textAlign: "center",
								marginBottom: "1rem",
							}}>
							NFT was minted on
							<div style={{ fontWeight: 800, fontSize: "1rem" }}>
								{mintedAt.toDateString()}
							</div>
							<div style={{ fontWeight: 700, fontSize: "1.5rem" }}>
								{formatAMPM()}
							</div>
						</div>
						<Image
							style={{ width: "8rem" }}
							src={`https://gateway.ipfs.io/ipfs/${piece[2]}/${piece[3]}`}
							alt="PieceNFT"
						/>
					</div>
					<img
						style={{ width: "65%", borderRadius: "0.5rem" }}
						src={`https://gateway.ipfs.io/ipfs/${image[2]}/Shatranj.png`}
						alt="NFT"
					/>
				</div>
				<div
					className="message"
					style={{
						marginTop: "2rem",
						width: "100%",
						textAlign: "center",
						fontSize: "1.1rem",
					}}>
					You Defeated{" "}
					<span
						className="white"
						style={{ fontSize: "1.2rem", fontWeight: 700 }}>
						{metadata.attributes[2].value.split(" ") ===
						metadata.attributes[0].value
							? metadata.attributes[0].value
							: metadata.attributes[1].value}
						...
					</span>{" "}
					in{" "}
					<span
						className="moves"
						style={{ fontSize: "1.2rem", fontWeight: 700 }}>
						{metadata.attributes[3].value}
					</span>{" "}
					moves.
				</div>
			</Modal>
		</>
	);
};

const NFTCard = ({
	token_uri,
	token_id,
	setVisibility,
	skinData,
	setNftToSend,
}) => {
	const [nft, setNft] = useState();
	const { chainId } = useMoralis();
	const [playConfirmation] = useSound(Confirmation);
	const [playSocialNotify] = useSound(SocialNotify);
	const [isNFTMetaModalVisible, setIsNFTMetaModalVisible] = useState(false);
	const [selectedNFT, setSelectedNFT] = useState(null);

	const handleTransferClick = (nft) => {
		setNftToSend(nft);
		setVisibility(true);
		playSocialNotify();
	};
	useEffect(() => {
		fetch(token_uri)
			.then((res) => res.json())
			.then((res) => {
				setNft(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [token_uri]);
	return (
		<>
			{isNFTMetaModalVisible && (
				<NFTMetaModal
					isNFTMetaModalVisible={isNFTMetaModalVisible}
					setIsNFTMetaModalVisible={setIsNFTMetaModalVisible}
					nft={selectedNFT}
					sinkData={skinData}
					token_uri={token_uri}
					metadata={nft}
				/>
			)}
			<Card
				hoverable
				// loading
				actions={[
					<Tooltip title="View On Blockexplorer">
						<FileSearchOutlined
							onClick={() => {
								window.open(
									`${getExplorer(chainId)}address/${NFT_TOKEN_ADDRESS}`,
									"_blank"
								);
								// console.log(nft.metadata.image);
							}}
						/>
					</Tooltip>,
					<Tooltip title="Transfer NFT">
						<SendOutlined onClick={() => handleTransferClick(nft)} />
					</Tooltip>,
					<Tooltip title="View On OpenSea">
						<GiftOutlined
							onClick={() =>
								window
									.open(
										`https://testnets.opensea.io/assets/mumbai/${NFT_TOKEN_ADDRESS}/${token_id}/`,
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
								playSocialNotify();
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
						src={
							`https://gateway.ipfs.io/ipfs/${nft?.image.split("//")[1]}` ||
							"error"
						}
						fallback="data:image/png;base64,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"
						alt=""
						style={{ height: "300px" }}
					/>
				}>
				<Meta title={nft?.name} description={NFT_TOKEN_ADDRESS} />
			</Card>
		</>
	);
};
export default NFTBalance;

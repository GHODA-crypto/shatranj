import { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";

const useSkinData = (userAddress, opponentAddress, isPlayerWhite) => {
	const {
		data: [skinData],
	} = useMoralisQuery(
		"GameSkin",
		(query) => query.equalTo("userAddress", userAddress).limit(1),
		[userAddress],
		{
			autoFetch: true,
			live: true,
		}
	);
	const {
		data: [opponentSkinData],
	} = useMoralisQuery(
		"GameSkin",
		(query) => query.equalTo("userAddress", opponentAddress).limit(1),
		[opponentAddress],
		{
			autoFetch: true,
			live: true,
		}
	);
	const [skins, setSkins] = useState({});
	useEffect(() => {
		const skinDataAttributes = skinData?.attributes;
		const opponentSkinDataAttributes = opponentSkinData?.attributes;

		const userSkinPieces = skinData?.attributes
			? Object.keys(skinDataAttributes).filter((key) => key.length === 2)
			: [];
		const opponentSkinPieces = opponentSkinData?.attributes
			? Object.keys(opponentSkinData?.attributes).filter(
					(key) => key.length === 2
			  )
			: [];

		setSkins(() => {
			const tempSkins = {};

			for (const key of userSkinPieces) {
				if (isPlayerWhite) {
					if (key[0] === "w" && skinDataAttributes?.[key])
						tempSkins[key] = skinDataAttributes[key];
				} else {
					if (key[0] === "b" && skinDataAttributes?.[key])
						tempSkins[key] = skinDataAttributes[key];
				}
			}
			for (const key of opponentSkinPieces) {
				if (!isPlayerWhite) {
					if (key[0] === "w" && opponentSkinDataAttributes?.[key])
						tempSkins[key] = opponentSkinDataAttributes[key];
				} else {
					if (key[0] === "b" && opponentSkinDataAttributes?.[key])
						tempSkins[key] = opponentSkinDataAttributes[key];
				}
			}

			return tempSkins;
		});
	}, [skinData, opponentSkinData, isPlayerWhite]);

	return skins;
};

export default useSkinData;

import React, { useState } from "react";
import Game from "./Game";

const LiveChess = ({ user }) => {
	const [isMatching, setIsMatching] = useState(true);

	return (
		<div className="game">
			<Game user={user} isMatching={isMatching} setIsMatching={setIsMatching} />
		</div>
	);
};

export default LiveChess;

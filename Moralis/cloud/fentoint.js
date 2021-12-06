const { Chess } = require("chess.js");
const chess = new Chess();

pgn = `[Event "Rated Rapid game"]
[Site "https://lichess.org/LUzOiYiG"]
[Date "2020.11.01"]
[White "basketball89"]
[Black "RebeccaHarris"]
[Result "0-1"]
[UTCDate "2020.11.01"]
[UTCTime "20:25:25"]
[WhiteElo "2101"]
[BlackElo "2065"]
[WhiteRatingDiff "-6"]
[BlackRatingDiff "+42"]
[BlackTitle "GM"]
[Variant "Standard"]
[TimeControl "600+0"]
[ECO "C11"]
[Opening "French Defense: Classical Variation, Steinitz Variation"]
[Termination "Normal"]
[Annotator "lichess.org"]

1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. e5 { C11 French Defense: Classical Variation, Steinitz Variation } Nfd7 5. a3?! { (0.00 → -0.72) Inaccuracy. f4 was best. } (5. f4 c5 6. Nf3 Nc6 7. Be3 Qb6 8. a3 cxd4 9. Nxd4 Bc5) 5... c5 6. Be3 Nc6 7. f4 cxd4 8. Bxd4 Nxd4 9. Qxd4 Bc5 10. Qd2 O-O 11. Nf3 f6 12. b4?? { (-0.34 → -2.46) Blunder. O-O-O was best. } (12. O-O-O) 12... Bb6 13. Nd4? { (-1.97 → -3.39) Mistake. O-O-O was best. } (13. O-O-O fxe5 14. fxe5 a5 15. Bb5 axb4 16. axb4 Qe7 17. Na4 Bc7 18. Rhe1 Rf5 19. Bxd7 Bxd7) 13... Bxd4?! { (-3.39 → -2.11) Inaccuracy. Qe7 was best. } (13... Qe7 14. Nxe6 Qxe6 15. Qxd5 Qxd5 16. Nxd5 fxe5 17. O-O-O Bd8 18. Bc4 Kh8 19. fxe5 Nxe5 20. Bb3) 14. Qxd4 fxe5 15. fxe5 Qg5 16. Nxd5?? { (-2.09 → -7.43) Blunder. h4 was best. } (16. h4) 16... exd5 17. Qxd5+ Kh8 18. Bd3 Qe3+ 19. Kd1 Nxe5 20. Re1?! { (-12.72 → Mate in 11) Checkmate is now unavoidable. h3 was best. } (20. h3 Ng4 21. c4 Be6 22. Re1 Bxd5 23. Rxe3 Nxe3+ 24. Kd2 Nxc4+ 25. Bxc4 Bxc4 26. Re1 Rad8+) 20... Bg4+ 21. Be2 Bxe2+ 22. Rxe2 Rf1+ 23. Re1 Rxe1# { Black wins by checkmate. } 0-1`;

chess.load_pgn(pgn);

// console.log(chess.board());

const fenToGameState = fen => {
    const fenArr = fen.split(" ");
    const pieces = fenArr[0].split("/");
    const board = [];
    for (let i = 0; i < 8; i++) {
        board.push(pieces[i].split(""));
    }
    const turn = fenArr[1];
    const castling = fenArr[2];
    const enPassant = fenArr[3];
    const halfMoveClock = fenArr[4];
    const fullMoveNumber = fenArr[5];
    return { board, turn, castling, enPassant, halfMoveClock, fullMoveNumber };
};

const boardToState = b => {
    color = {
        w: "1",
        b: "0",
    };
    piece = {
        p: "001",
        b: "010",
        n: "011",
        r: "100",
        q: "101",
        k: "110",
    };
    b.reverse();
    let board = "0b";
    for (let i = 7; i >= 0; i--) {
        for (let j = 7; j >= 0; j--) {
            board += b[i][j] ? color[b[i][j].color] + piece[b[i][j].type] : "0000";
        }
    }
    return BigInt(board);
};

console.log(boardToState(chess.board()));

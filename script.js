const cells = document.querySelectorAll(".cell");

const turnDisplay = document.getElementById("turnDisplay");
const result = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");

const playerMode = document.getElementById("playerMode");
const aiMode = document.getElementById("aiMode");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const scoreDrawElement = document.getElementById("scoreDraw");

const playerTwoLabel = document.getElementById("playerTwoLabel");

let board = ["", "", "", "", "", "", "", "",];

let currentPlayer = "X";
let gameActive = true;
let isAIMode = false;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

/* =========================
   CELL CLICK
========================= */

cells.forEach((cell) => {

    cell.addEventListener("click", function () {

        const index = Number(this.dataset.index);

        console.log("Clicked cell:", index + 1);

        if (!gameActive) {
            return;
        }

        if (board[index] !== "") {
            return;
        }

        // In AI mode, don't allow clicking when AI is playing
        if (isAIMode && currentPlayer === "O") {
            return;
        }

        makeMove(index, currentPlayer);

        if (checkGameEnd()) {
            return;
        }

        currentPlayer =
            currentPlayer === "X" ? "O" : "X";

        updateTurn();

        // AI turn
        if (isAIMode && currentPlayer === "O") {

            setTimeout(() => {
                makeAIMove();
            }, 500);
        }
    });
});


/* =========================
   MAKE MOVE
========================= */

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player.toLowerCase()
    );
}


/* =========================
   UPDATE TURN
========================= */

function updateTurn() {

    if (isAIMode && currentPlayer === "O") {

        turnDisplay.textContent = "AI's Turn";

    } else {

        turnDisplay.textContent =
            `Player ${currentPlayer}'s Turn`;
    }
}


/* =========================
   CHECK WIN / DRAW
========================= */

function checkGameEnd() {

    let winningCombination = null;

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winningCombination = combination;

            break;
        }
    }


    // WINNER
    if (winningCombination !== null) {

        gameActive = false;

        winningCombination.forEach((index) => {

            cells[index].classList.add("winner");

        });

        const winner =
            board[winningCombination[0]];


        if (winner === "X") {

            scoreX++;

            scoreXElement.textContent = scoreX;

            if (isAIMode) {

                result.textContent = "🎉 You Win!";

            } else {

                result.textContent =
                    "🎉 Player X Wins!";
            }

        } else {

            scoreO++;

            scoreOElement.textContent = scoreO;

            if (isAIMode) {

                result.textContent = "🤖 AI Wins!";

            } else {

                result.textContent =
                    "🎉 Player O Wins!";
            }
        }

        return true;
    }


    // DRAW
    if (!board.includes("")) {

        gameActive = false;

        scoreDraw++;

        scoreDrawElement.textContent = scoreDraw;

        result.textContent = "🤝 It's a Draw!";

        return true;
    }

    return false;
}


/* =========================
   AI MOVE
========================= */

function makeAIMove() {

    if (!gameActive) {
        return;
    }

    const emptyCells = board
        .map((value, index) => {

            if (value === "") {
                return index;
            }

            return null;

        })
        .filter(index => index !== null);


    if (emptyCells.length === 0) {
        return;
    }


    // 1. Try to win
    let move = findBestMove("O");


    // 2. Block player
    if (move === null) {

        move = findBestMove("X");
    }


    // 3. Take center
    if (move === null && board[4] === "") {

        move = 4;
    }


    // 4. Take random empty cell
    if (move === null) {

        const randomIndex =
            Math.floor(
                Math.random() * emptyCells.length
            );

        move = emptyCells[randomIndex];
    }


    makeMove(move, "O");


    if (checkGameEnd()) {
        return;
    }


    currentPlayer = "X";

    turnDisplay.textContent = "Your Turn";
}


/* =========================
   FIND BEST AI MOVE
========================= */

function findBestMove(player) {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;

        const values = [
            board[a],
            board[b],
            board[c]
        ];


        if (
            values.filter(
                value => value === player
            ).length === 2
            &&
            values.includes("")
        ) {

            return combination[
                values.indexOf("")
            ];
        }
    }

    return null;
}


/* =========================
   RESTART
========================= */

restartBtn.addEventListener(
    "click",
    restartGame
);


function restartGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameActive = true;

    result.textContent = "";

    turnDisplay.textContent =
        "Player X's Turn";


    cells.forEach((cell) => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });
}


/* =========================
   PLAYER VS PLAYER
========================= */

playerMode.addEventListener(
    "click",
    function () {

        isAIMode = false;

        playerMode.classList.add("active");

        aiMode.classList.remove("active");

        playerTwoLabel.textContent =
            "Player O";

        restartGame();
    }
);


/* =========================
   PLAYER VS AI
========================= */

aiMode.addEventListener(
    "click",
    function () {

        isAIMode = true;

        aiMode.classList.add("active");

        playerMode.classList.remove("active");

        playerTwoLabel.textContent = "AI";

        restartGame();
    }
);
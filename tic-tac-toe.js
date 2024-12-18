const displayController = (() => {
    const renderResultMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }

    const renderNameMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }


    return { renderResultMessage, renderNameMessage };
})();

const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    }

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;

    return { render, update, getGameboard };
})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark
    };
}

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        if (validations.checkName() === "emptyNames") {
            displayController.renderNameMessage("Choose names for both Players");
            return;
        } else if (validations.checkName() === "equalNames") {
            displayController.renderNameMessage("Choose another name for Player 2");
            return;
        } else {
            displayController.renderNameMessage("");

        }

        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    }

    const handleClick = (event) => {

        if (gameOver) {
            return;
        }
        let index = parseInt(event.target.id.split("-")[1]);
        if (Gameboard.getGameboard()[index] !== "") {
            return;
        }

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (validations.checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            displayController.renderResultMessage(`${players[currentPlayerIndex].name} wins!`);
            setTimeout(restart, 2000);
        } else if (validations.checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderResultMessage("It's a tie");
            setTimeout(restart, 2000);
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        gameOver = false;
        document.querySelector("#message").innerHTML = "";
        document.querySelector("#player1").value = "";
        document.querySelector("#player2").value = "";
        document.querySelector("#gameboard").innerHTML = "";
    }

    return { start, handleClick, restart };
})();

const validations = (() => {

    function checkForWin(board) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }

        }
        return false;
    }

    function checkForTie(board) {
        return board.every(cell => cell !== "");
    }

    function checkName() {
        const player1Name = document.querySelector("#player1").value;
        const player2Name = document.querySelector("#player2").value;

        if (player1Name === "" || player2Name === "") {
            return "emptyNames";
        }

        if (player1Name === player2Name) {
            return "equalNames";
        }
    }

    return {checkForWin, checkForTie, checkName};
})()



const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
})

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
    Game.start();
})
const Player = (name, symbol, turn, score) => {
    return { name, symbol, turn, score }
}

const gameBoard = (() => {
    const board = new Array(9);
    const gameContainer = document.querySelector(".game-container");

    // Create gameboard tiles
    const createTiles = () => {
        for (let i = 0; i < board.length; i++) {
            const tiles = gameContainer.appendChild(document.createElement("div"));

            gameContainer.classList.add("tiles-container", "display-flex", "justify-center");
            tiles.classList.add("game-tiles", "display-flex", "align-center", "justify-center", "cursor-pointer");
        }
    }

    return { board, createTiles }
})();

const displayController = (() => {
    gameBoard.createTiles();

    let currentSymbol = "X";
    let moveCounter = 0;
    let player1ScoreDisplay = document.querySelector(".player1-score");
    let player2ScoreDisplay = document.querySelector(".player2-score");
    const player1 = Player("Player 1", "X", false, 0);
    const player2 = Player("Player 2", "O", false, 0);
    const pieces = document.querySelectorAll(".game-tiles");
    const winnerWrapper = document.querySelector(".winner-wrapper");

    // Give names to the players on button click
    const enterNames = (buttons, names) => {
        for(let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", (e) => {
                e.preventDefault();
                player1.name = names[0].value;
                player2.name = names[1].value;
                buttons[i].classList.remove("show-button");
            });
        }
    }

    // Show form button
    const showButtons = (buttons, names) => {
        for(let i = 0; i < names.length; i++) {
            names[i].addEventListener("input", () => {
                buttons[i].classList.add("show-button");
            });
        }
    }

    // Toggle player symbols
    const toggleSymbol = () => {
        if(
            gameBoard.board.includes(player1.symbol) || 
            gameBoard.board.includes(player2.symbol)
        ) {
            if (currentSymbol === "X") {
                player1.turn = false;
                player2.turn = true;
                currentSymbol = player2.symbol;
            } else {
                player2.turn = false;
                player1.turn = true;
                currentSymbol = player1.symbol;
            }

            moveCounter++;
            playerTurnDisplay();
        }
    }

    // Reset pieces and counter
    const resetBoard = () => {
        for(let i = 0; i < pieces.length; i++) {
            gameBoard.board[i] = null; 
            pieces[i].textContent = "";
        }

        moveCounter = 0;
    }

    // Start a new round on button click
    const newRound = () => {
        const newRoundButton = document.querySelector(".new-round");

        newRoundButton.addEventListener("click", () => {
            winnerWrapper.classList.remove("show-winner");
            resetBoard();
        });
    }

    // Reset all and start a new game
    const newGame = (resetButton) => {
        const forms = document.querySelectorAll("form");

        resetButton.addEventListener("click", () => {
            player1.score = 0;
            player2.score = 0;
            player1.turn = true;
            player2.turn = false;
            player1.name = "Player 1";
            player2.name = "Player 2";
            player1ScoreDisplay.textContent = player1.score;
            player2ScoreDisplay.textContent = player2.score;
            winnerWrapper.classList.remove("show-winner");
            currentSymbol = "X";
            for(let form of forms) {
                form.reset();
            }
            playerTurnDisplay();
            resetBoard();
        });
    }

    // Shows a drop shadow that indicates the player turn
    const playerTurnDisplay = () => {
        const player1Info = document.querySelector(".player1-info");
        const player2Info = document.querySelector(".player2-info");

        if(player1.turn === true) {
            player1Info.classList.add("player1-turn");
            player2Info.classList.remove("player2-turn");
        } else if(player2.turn === true) {
            player2Info.classList.add("player2-turn");
            player1Info.classList.remove("player1-turn");
        }
    }

    // Controlls what happens when a player wins (or when there is a tie)
    const onWin = () => {
        let winnerSymbol = currentSymbol;
        const winnerText = document.querySelector(".winner-text");
        
        winnerWrapper.classList.add("show-winner");
        
        if(currentSymbol === player1.symbol) {
            player1.score++;
            player1ScoreDisplay.textContent = player1.score;
            winnerText.textContent = `${player1.name} wins!`;
            currentSymbol = player2.symbol;
        } else if (currentSymbol === player2.symbol) {
            player2.score++;
            player2ScoreDisplay.textContent = player2.score;
            winnerText.textContent = `${player2.name} wins!`;
            currentSymbol = player1.symbol;
        } 
        
        currentSymbol = winnerSymbol;
        
        if(currentSymbol === "T") {
            winnerText.textContent = "It's a tie!";
            if(player1.turn === false) {
                currentSymbol = "X";
            } else {
                currentSymbol = "O";
            }
        }

        playerTurnDisplay();
    }

    // Conditions to win or tie a game
    const playerMoves = () => {
        if (moveCounter === 8) {
            currentSymbol = "T";
            onWin();
        }

        if(moveCounter >= 4) {
            // Check horizontal rows
            if (
                gameBoard.board[0] === currentSymbol &&
                gameBoard.board[1] === currentSymbol &&
                gameBoard.board[2] === currentSymbol
            ) {
                onWin();
            } else if (
                gameBoard.board[3] === currentSymbol &&
                gameBoard.board[4] === currentSymbol &&
                gameBoard.board[5] === currentSymbol
            ) {
                onWin();
            } else if (
                gameBoard.board[6] === currentSymbol &&
                gameBoard.board[7] === currentSymbol &&
                gameBoard.board[8] === currentSymbol
            ) {
                onWin();
            } 
            
            // Check vertical rows
            if (
                gameBoard.board[0] === currentSymbol &&
                gameBoard.board[3] === currentSymbol &&
                gameBoard.board[6] === currentSymbol
            ) {
                onWin();
            } else if (
                gameBoard.board[1] === currentSymbol &&
                gameBoard.board[4] === currentSymbol &&
                gameBoard.board[7] === currentSymbol
            ) {
                onWin();
            } else if (
                gameBoard.board[2] === currentSymbol &&
                gameBoard.board[5] === currentSymbol &&
                gameBoard.board[8] === currentSymbol
            ) {
                onWin();
            } 
            
            // Check diagonal rows
            if (
                gameBoard.board[0] === currentSymbol &&
                gameBoard.board[4] === currentSymbol &&
                gameBoard.board[8] === currentSymbol
            ) {
                onWin();
            } else if (
                gameBoard.board[2] === currentSymbol &&
                gameBoard.board[4] === currentSymbol &&
                gameBoard.board[6] === currentSymbol    
            ) {
                onWin();
            }
        }

        toggleSymbol();
    }

    // Renders symbols when a tile is clicked
    const renderSymbols = () => {
        for (let i = 0; i < pieces.length; i++) {
            pieces[i].addEventListener("click", () => {
                if (pieces[i].textContent === "") {
                    gameBoard.board[i] = currentSymbol;
                    pieces[i].textContent = gameBoard.board[i];
                    playerMoves();
                }
                
                return true;
            });     
        }
    }

    const init = () => {
        const submitButtons = document.querySelectorAll(".submit-button");
        const playerNames = document.querySelectorAll(".player-name");
        const reset = document.querySelector(".reset-button");

        enterNames(submitButtons, playerNames);
        showButtons(submitButtons, playerNames);
        renderSymbols();
        newGame(reset);
        newRound();
    }

    return { init }
})();

window.addEventListener("DOMContentLoaded", displayController.init);
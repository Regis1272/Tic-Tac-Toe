"use strict";
let currentTurn = 0;
const playerFactory = (name, playerNum) => {
    let ticVal = '';
    if (playerNum === 1) {
        ticVal = 'O';
    }
    else {
        ticVal = 'X';
    }
    return { name, number: playerNum, ticVal };
};
let player1 = playerFactory('Billy', 1);
let player2 = playerFactory('Computer', 2);
let currentPlayer = player1;
let gameBoard = document.getElementById('gameBoard');
if (gameBoard === null) {
    throw new Error('gameBoard is null');
}
const buildBoard = (() => {
    // variables
    let index = 0;
    const size = 3;
    let ticTacArray = [0, 0, 0,
        0, 0, 0,
        0, 0, 0];
    // functions
    const playAudio = (playerNum, winState) => {
        if (winState === true) {
            let winSnd = new Audio('./sounds/star-sounds.mp3');
            winSnd.volume = 0.9;
            winSnd.play();
        }
        else if (playerNum === 1) {
            let moonSnd = new Audio('./sounds/magical-surprise.mp3');
            moonSnd.volume = 0.4;
            moonSnd.play();
        }
        else {
            let starSnd = new Audio('./sounds/shooting-star.mp3');
            starSnd.volume = 0.4;
            starSnd.play();
        }
        // let gameFinish = new Audio('./sounds/star-sounds.mp3');
    };
    const checkBoard = (gameState, player) => {
        const flattenBoard = (gameState, ticVal) => {
            return gameState.map(tic => {
                if (tic == ticVal) {
                    return '🏆';
                }
                else {
                    return '🔲';
                }
            });
        };
        //BUG: When there a player has made more than 3 moves, the flattened board will never match any win state.
        let gameStateNew = flattenBoard(gameState, player.ticVal);
        console.log("Current Player Win State: " + gameStateNew);
        const winStates = [
            // Horizontal wins
            ['🏆', '🏆', '🏆',
                '🔲', '🔲', '🔲',
                '🔲', '🔲', '🔲'],
            ['🔲', '🔲', '🔲',
                '🏆', '🏆', '🏆',
                '🔲', '🔲', '🔲'],
            ['🔲', '🔲', '🔲',
                '🔲', '🔲', '🔲',
                '🏆', '🏆', '🏆'],
            // Vertical wins
            ['🏆', '🔲', '🔲',
                '🏆', '🔲', '🔲',
                '🏆', '🔲', '🔲'],
            ['🔲', '🏆', '🔲',
                '🔲', '🏆', '🔲',
                '🔲', '🏆', '🔲'],
            ['🔲', '🔲', '🏆',
                '🔲', '🔲', '🏆',
                '🔲', '🔲', '🏆'],
            // Diagonal wins
            ['🏆', '🔲', '🔲',
                '🔲', '🏆', '🔲',
                '🔲', '🔲', '🏆'],
            ['🔲', '🔲', '🏆',
                '🔲', '🏆', '🔲',
                '🏆', '🔲', '🔲']
        ];
        for (let i = 0; i < winStates.length; i++) {
            if (gameStateNew.toString() === winStates[i].toString()) {
                playAudio(3, true);
                console.log(player.name + " wins!");
            }
        }
    };
    const playTurn = (player, cell, index, handler) => {
        let tic = document.createElement('div');
        console.log(player);
        tic.style.display = 'flex';
        tic.style.width = '100%';
        tic.style.height = '100%';
        if (player.number === 1) {
            cell.style.backgroundImage = "url(./images/eclipse-flare.svg)";
            if (cell.firstChild !== null)
                cell.firstChild.classList.add('moon');
            playAudio(1, false);
        }
        else {
            cell.firstChild.backgroundImage = "url(./images/sparkles.svg)";
            cell.classList.add('stars');
            playAudio(2, false);
        }
        cell.appendChild(tic);
        ticTacArray[index] = player.ticVal;
        cell.removeEventListener('mousedown', handler);
    };
    const makePixel = (index) => {
        let handleEvent = () => {
            console.log(index);
            if (currentTurn % 2 === 0) {
                currentTurn += 1;
                playTurn(player1, pixel, index, handleEvent);
                checkBoard(ticTacArray, player1);
            }
            else {
                currentTurn += 1;
                playTurn(player2, pixel, index, handleEvent);
                checkBoard(ticTacArray, player2);
            }
        };
        let pixel = document.createElement('div');
        let pixel2 = document.createElement('div');
        pixel2.classList.add('pixel_bg');
        pixel.appendChild(pixel2);
        pixel.classList.add('pixel_bg');
        pixel.id = index.toString();
        /* Styling */
        pixel.style.display = 'flex';
        pixel.style.width = '100%';
        pixel.style.height = '100%';
        pixel.addEventListener('mousedown', handleEvent);
        return pixel;
    };
    const makeRow = () => {
        let row = document.createElement('div');
        row.classList.add('row');
        row.style.display = 'flex';
        row.style.width = '100%';
        row.style.height = '100%';
        return row;
    };
    /* let boardContainer = document.createElement('div');
    boardContainer.style.display = 'flex';
    boardContainer.style.flexDirection = 'column';
    boardContainer.style.width = '800px';
    boardContainer.style.height = '800px';
    boardContainer.id = 'gameBoard'; */
    for (let x = 0; x < size; x++) {
        let row = makeRow();
        for (let y = 0; y < size; y++) {
            let square = makePixel(index);
            row.appendChild(square);
            index++;
        }
        gameBoard.appendChild(row);
    }
})();
// Prompt for player names, instantiate instances of these objects (using factory functions)
//
// make gameboard
//  create 3 rows of 3 squares each with a click event listener
//      if player 1 clicks, X
//      if player 2 clicks, O
//      if there are 3 of either in a row vertical/horiz/diagonal -- declare winner

"use strict";
// woah typescript!
//
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
const buildBoard = (() => {
    // functions
    const playAudio = (playerNum) => {
        if (playerNum === 1) {
            let moonSnd = new Audio('./sounds/magical-surprise.mp3');
            moonSnd.play();
        }
        else {
            let starSnd = new Audio('./sounds/shooting-star.mp3');
            starSnd.play();
        }
        // let gameFinish = new Audio('./sounds/star-sounds.mp3');
    };
    const playTurn = (player, cell, index, handler) => {
        let tic = document.createElement('div');
        console.log(player);
        tic.style.display = 'flex';
        tic.style.width = '100%';
        tic.style.height = '100%';
        if (player.number === 1) {
            tic.style.backgroundImage = "url(./images/eclipse-flare.svg)";
            playAudio(1);
        }
        else {
            tic.style.backgroundImage = "url(./images/sparkles.svg)";
            playAudio(2);
        }
        cell.appendChild(tic);
        ticTacArray[index] = player.ticVal;
        console.log(ticTacArray);
        cell.removeEventListener('mousedown', handler);
    };
    const makePixel = (index) => {
        let handleEvent = () => {
            console.log(index);
            if (currentTurn % 2 === 0) {
                console.log(currentTurn);
                currentTurn += 1;
                playTurn(player1, pixel, index, handleEvent);
            }
            else {
                currentTurn += 1;
                playTurn(player2, pixel, index, handleEvent);
            }
        };
        let pixel = document.createElement('div');
        pixel.classList.add('pixel');
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
    let index = 0;
    const size = 3;
    let ticTacArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let boardContainer = document.createElement('div');
    boardContainer.style.display = 'flex';
    boardContainer.style.flexDirection = 'column';
    boardContainer.style.width = '800px';
    boardContainer.style.height = '800px';
    boardContainer.id = 'gameBoard';
    for (let x = 0; x < size; x++) {
        let row = makeRow();
        for (let y = 0; y < size; y++) {
            let square = makePixel(index);
            row.appendChild(square);
            index++;
        }
        boardContainer.appendChild(row);
    }
    return { boardContainer, ticTacArray };
})();
let gameBoard = buildBoard;
document.body.appendChild(gameBoard.boardContainer);
// Prompt for player names, instantiate instances of these objects (using factory functions)
//
// make gameboard
//  create 3 rows of 3 squares each with a click event listener
//      if player 1 clicks, X
//      if player 2 clicks, O
//      if there are 3 of either in a row vertical/horiz/diagonal -- declare winner

"use strict";
let gameBoard = document.getElementById('gameBoard');
if (gameBoard === null) {
    throw new Error('gameBoard is null');
}
let currentTurn = 1;
/*********** FUNCTIONS **********/
const emitPlayerAudio = (playerId) => {
    if (playerId === 1) {
        let moonSnd = new Audio('./sounds/magical-surprise.mp3');
        moonSnd.volume = 0.4;
        moonSnd.play();
    }
    else {
        let starSnd = new Audio('./sounds/shooting-star.mp3');
        starSnd.volume = 0.4;
        starSnd.play();
    }
};
// Eventually will use a form instead.
const promptPlayer = () => {
    let name = prompt("What is your name?", "Stardust Equinox");
    let moonOrStars = prompt("Moon or Stars?", "Moon");
    if (name === null) {
        console.log("Please enter a valid name.");
        return promptPlayer();
    }
    if (moonOrStars === null) {
        console.log("Please enter a valid choice.");
        return promptPlayer();
    }
    return { name, moonOrStars };
};
const makePlayer = (name, playerChoice) => {
    let ticVal = '';
    let playerNum = 0;
    if (playerChoice.toLowerCase() === "moon") {
        playerNum = 1;
        ticVal = 'O';
    }
    else {
        playerNum = 2;
        ticVal = 'X';
    }
    return { name, id: playerNum, ticVal };
};
let player1 = makePlayer('Xarbo', 'moon');
let player2 = makePlayer('Computer', 'stars');
//Immediately initialize board
const buildBoard = (() => {
    let index = 0;
    const size = 3;
    let sqrClassName = 'square_bg';
    let rowClassName = 'row';
    const makeSquare = () => {
        // div that will display our "X" and "O"s
        // set class + id for styling + future handlers
        let square = document.createElement('div');
        square.classList.add(sqrClassName);
        // append a foreground div to square to make
        // our animations work
        let square_fg = document.createElement('div');
        square_fg.classList.add('square_fg');
        square_fg.id = index.toString();
        square.appendChild(square_fg);
        return square;
    };
    const makeRow = () => {
        let row = document.createElement('div');
        row.classList.add(rowClassName);
        return row;
    };
    for (let x = 0; x < size; x++) {
        let row = makeRow();
        for (let y = 0; y < size; y++) {
            let square = makeSquare();
            row.appendChild(square);
            index++;
        }
        gameBoard.appendChild(row);
    }
})();
// Add event handlers and interaction to board
const addLogic = () => {
    const handlePlay = (index) => {
        console.log("Click detected!");
        console.log("Current Turn: " + currentTurn);
        if (currentTurn % 2 === 1) {
            playTurn(player1, index);
        }
        else {
            playTurn(player2, index);
        }
    };
    const playTurn = (player, sqrId) => {
        let curSquare = document.getElementById(sqrId.toString());
        if (curSquare === null) {
            throw new Error("There's no square at " + sqrId);
        }
        currentTurn += 1;
        console.log(player.name + " has played!");
        // Get index of square for changing the gameState
        animateSqr(player.id, curSquare);
        emitPlayerAudio(player.id);
        // update Game State
        ticTacArray[sqrId] = player.ticVal;
        curSquare.removeEventListener('click', () => handlePlay(sqrId));
    };
    let foreground = document.querySelectorAll('.square_fg');
    foreground.forEach((square, index) => {
        square.addEventListener('click', () => handlePlay(index));
    });
};
// for triggering an animation in our event handlers
function animateSqr(playerId, square) {
    let parentSquare = square.parentNode; // type assertion!
    if (playerId === 1) {
        parentSquare.classList.add('moon');
    }
    else {
        parentSquare.classList.add('stars');
    }
    square.classList.add('square_fade');
}
let ticTacArray = [0, 0, 0,
    0, 0, 0,
    0, 0, 0];
addLogic();
/* let playerChoices = promptPlayer();
let player1 = makePlayer(playerChoices.name, playerChoices.moonOrStars);
let player2 = makePlayer('Computer', "stars");
*/
// future functionality:
// players coin toss
// winner gets to choose who goes first.
// set variable "oddPlayer" equal to whoever goes first
// this will preserve existing game logic

type Player = {
    name: string;
    id: number;
    ticVal: string;
}

type GameState = (number | string)[];

type WinState = (string)[];

let gameBoard = document.getElementById('gameBoard');
if (gameBoard === null) {
    throw new Error('gameBoard is null');
}

let currentTurn = 1;

/*********** FUNCTIONS **********/

const emitPlayerAudio = (playerId: number) => {
    if (playerId === 1) {
        let moonSnd = new Audio('./assets/sounds/magical-surprise.mp3');
		moonSnd.volume = 0.4;
		moonSnd.play();
    } else {
        let starSnd = new Audio('./assets/sounds/shooting-star.mp3');
        starSnd.volume = 0.4;
        starSnd.play();
    }
}

// Eventually will use a form instead.
const promptPlayer = (): {name: string, moonOrStars: string} => {
    let name = prompt("What is your name?", "Stardust Equinox");
    let moonOrStars = prompt("Moon or Stars?", "Moon");

    if (name === null) {
        console.log("Please enter a valid name.")
        return promptPlayer();
    }
    if (moonOrStars === null) {
        console.log("Please enter a valid choice.");
        return promptPlayer();
    }

    return {name, moonOrStars};
}

const makePlayer = (name:string, playerChoice:string) => {
	let ticVal = '';
    let playerNum = 0;
	if (playerChoice.toLowerCase() === "moon") {
        playerNum = 1;
		ticVal = 'O';
	} else {
        playerNum = 2;
		ticVal = 'X';
        }
	return {name, id: playerNum, ticVal};
}

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
    }

    const makeRow = () => {
        let row = document.createElement('div');
        row.classList.add(rowClassName);
        
        return row;
    }

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
// contains win-checks
const addLogic = () => {

    const handlePlay = (index: number) => {
        console.log("Click detected!");
        console.log("Current Turn: " + currentTurn);
        if (currentTurn % 2 === 1) {
            playTurn(player1, index);
            checkWin(ticTacArray, player1);
        } else {
            playTurn(player2, index);
            checkWin(ticTacArray, player2);
        }
    }

    const playTurn = (player: Player, sqrId: number) => {
        let curSquare = document.getElementById(sqrId.toString())
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
    }


    // calculates trophy indices for each win condition
    // these will be matched with values at the same indices in the current game state
    function getWinIndex() {

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

        let winIndices: number[][]= [];
        for (let i = 0; i < winStates.length; i++) {
            winIndices[i] = [];
            for (let j = 0; j < winStates[i].length; j++) {
                if (winStates[i][j] === '🏆') {
                    winIndices[i].push(j);
                }
            }
            console.log("win Indices: " + winIndices);
        }

        console.log('final win indices: ' + winIndices);
        console.log('3rd index of win indices: ' + winIndices[2]);
        console.log('5rd index of win indices: ' + winIndices[4]);
        console.log('3rd index of 3rd index of win indices: ' + winIndices[2][2]);
        return winIndices;
    }

    let winIndex = getWinIndex();

    // Using the win indices, checks for win against curr game state
	const checkWin = (gameState: GameState, player: Player) => {

        // converts to a player-neutral format
		const flattenBoard = (gameState: GameState, ticVal: number | string) => {
			return gameState.map(element => {
				if (element === ticVal) {
					return '🏆';
				} else {
					return '🔲';
				}
			});
		}
		
		//BUG: When there a player has made more than 3 moves, the flattened board will never match any win state.
		let gameStateNew = flattenBoard(gameState, player.ticVal);
		console.log("Current Player Win State: " + gameStateNew);

        let gameChecker: number[][] = [];
        for (let i = 0; i < winIndex.length; i++) {
            gameChecker[i] = [];
            for (let j = 0; j < winIndex[i].length; j++) {  
                // get val at the indices of gameStateNew that are contained within winIndex[j];
                let winItem = winIndex[i][j];
                if (gameStateNew[winItem] == '🏆') {
                    gameChecker[i].push(winItem);
                } else {
                    gameChecker[i].push(-1);
                }
            }
            if (gameChecker[i].toString() === winIndex[i].toString()){
                console.log("OMGOMGOMG WIN DETECTED!")
            }
        }
        console.log("gameChecker: " + gameChecker);
	}

    // add event handlers to foreground squares
    // >>> trigger animation + play turn + check win conditions
    let foreground = document.querySelectorAll('.square_fg');
    foreground.forEach((square, index) => {
        square.addEventListener('click', () => handlePlay(index));
    })

}


// for triggering an animation in our event handlers
function animateSqr(playerId: number, square: HTMLElement) {
    let parentSquare = square.parentNode as HTMLElement; // type assertion!
    
    if (playerId === 1) {
            parentSquare.classList.add('moon');
    } else {
            parentSquare.classList.add('stars');
    }

    square.classList.add('square_fade');
}

function transitionForeground() {
    let fg = document.getElementById('foreground') as HTMLElement;
    fg.classList.add('slideOut');
    emitLoopAudio();
}

function emitLoopAudio() {
    let music = new Audio('./sounds/Jellyfish in Space.mp3');
    music.loop = true;
    setTimeout(() => {music.play()}, 500);
}

function handleButton(button: HTMLElement) {
    transitionForeground();
    emitLoopAudio();
    if (button.id === 'moonButton') {
        player1 = makePlayer('Player 1', 'moon');
        player2 = makePlayer('Player 2', 'stars');
    } else {
        player1 = makePlayer('Player 1', 'stars');
        player2 = makePlayer('Player 2', 'moon');
    }
}

let player1: Player;
let player2: Player;

let moonButton = document.getElementById('moonButton') as HTMLElement;
let starButton = document.getElementById('starButton') as HTMLElement;

moonButton.addEventListener('click', () => {handleButton(moonButton)});
starButton.addEventListener('click', () => {handleButton(starButton)});

let ticTacArray: GameState =
		[0,0,0
		,0,0,0
		,0,0,0];

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

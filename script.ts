// woah typescript!
//

type Player = {
    number: number;
    ticVal: string;
}

let player1 = {number: 2, ticVal: 'O'};

let currentPlayer = player1;

const buildBoard = (() => {
    // functions
	const playTurn = (player: Player, cell: HTMLElement, index: number, handler: any) => {
		let tic = document.createElement('div');
		tic.style.display = 'flex';
		tic.style.width = '100%';
		tic.style.height = '100%';
		if (player.number === 1) {
			tic.style.backgroundImage = "url(./images/eclipse-flare.svg)";
		} else {
			tic.style.backgroundImage = "url(./images/sparkles.svg)";
		}
		cell.appendChild(tic);
		ticTacArray[index] = player.ticVal;
		cell.removeEventListener('mousedown', handler);
	}
    

	const makePixel = (index:number) => {

		let handleEvent = () => {
			console.log(index);
			playTurn(currentPlayer, pixel, index, handleEvent);
		}

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
    let ticTacArray: (number | string)[] = [0,0,0,0,0,0,0,0,0];

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


    return {boardContainer, ticTacArray}
})();

/* const playerFactory = (name:string) => {
    return {name, state, play()}
} */

let gameBoard = buildBoard;
document.body.appendChild(gameBoard.boardContainer);
// Prompt for player names, instantiate instances of these objects (using factory functions)
//
// make gameboard
//  create 3 rows of 3 squares each with a click event listener
//      if player 1 clicks, X
//      if player 2 clicks, O
//      if there are 3 of either in a row vertical/horiz/diagonal -- declare winner

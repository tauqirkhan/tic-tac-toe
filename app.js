function Gameboard(){

    const board = [];
    const grid = 3;

    //Made board array with 3 array inside each array insert cell function 
    for (let row = 0; row < grid; row++){
        board[row] = [];
        for (let column = 0; column < grid; column++){
            board[row].push(Cell());
        }
    }

    const getBoard = () => board;

    function dropTokens(player, gridObj){

        for(let row = 0; row < grid; row++){
            for(let column = 0; column < grid; column++){
                if(row == gridObj.row && column == gridObj.column){
                    if(board[row][column].getValue() !== null){
                        return false;
                    } else{
                        board[row][column].addToken(player);
                        return true;
                    }
                }
            }
        }
    }

    return {
            dropTokens, 
            getBoard
        };

};

function Cell(){
    
    let value = null;

    function addToken(player){
        value = player.playerToken;
    }

    const getValue = () => value;

    return {
        getValue, 
        addToken
    };
}
 
function gameController(){

    const gameBoard = Gameboard();
    const board = gameBoard.getBoard();

    let isWin;
    let switchPlayer;

    players = [
        {
            name : 'playerOne',
            playerToken : 'O'
        },
        {
            name : 'playerTwo',
            playerToken : 'X'
        }
    ]

    let activePlayer = players[0];

    let resetPlayer = () => activePlayer = players[0];

    let switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0] ? players[1] : players[0]);
    };

    const getActivePlayer = () => activePlayer;

    const checkWinStatus = () => isWin;

    function playNewRound(position){
        
        switchPlayer = gameBoard.dropTokens(activePlayer, position);

        isWin = checkWin();

        handlePlayerSwitch();
    }

    function checkDraw(){
        //Check if any null left board
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(board[i][j].getValue() === null) return false;
            }
        }

        //Check if anyone win
        if(isWin) return false;

        //Else return true
        return true;
    }

    function handlePlayerSwitch(){
        if(switchPlayer){
            switchPlayerTurn();
        }
    }

    function checkWin(){
        let currentPlayerToken = getActivePlayer().playerToken;

        //Check row
        for(let i = 0; i < 3; i++){
            if( board[i][0].getValue() === currentPlayerToken && 
                board[i][1].getValue() === currentPlayerToken && 
                board[i][2].getValue() === currentPlayerToken){
                    return true;
            }
        }

        //Check column
        for(let i = 0; i < 3; i++){
            if( board[0][i].getValue() === currentPlayerToken &&
                board[1][i].getValue() === currentPlayerToken &&
                board[2][i].getValue() === currentPlayerToken){
                    return true;
                }
        }

        //Check diagonal
        if((board[0][0].getValue() === currentPlayerToken &&
            board[1][1].getValue() === currentPlayerToken &&
            board[2][2].getValue() === currentPlayerToken) ||
           (board[0][2].getValue() === currentPlayerToken &&
            board[1][1].getValue() === currentPlayerToken &&
            board[2][0].getValue() === currentPlayerToken)){
                return true;
        }
        return false;
    }

    return {
        checkDraw,
        checkWinStatus,
        resetPlayer,
        playNewRound,
        getActivePlayer,
        getBoard: gameBoard.getBoard,
    };
}

function ScreenController(){

    const game = gameController();
    const board = game.getBoard();

    const playerTurnDiv = document.querySelector('.playerTurn');
    const boardDiv = document.querySelector('.board');
    const restart = document.querySelector('.restart');

    boardDiv.addEventListener('click', playMove);
    restart.addEventListener('click', clearCellValue);

    updateScreen();

    //Functions
    function updateScreen(){ 

        const currentPlayerName = game.getActivePlayer().name;
        boardDiv.textContent = '';
        
        playerTurnDiv.textContent = `${currentPlayerName} turn...`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellBtn = document.createElement('button');
                cellBtn.classList.add('cellBtn');

                //Solution for assigning exact position to each cell
                cellBtn.dataset.row = rowIndex;
                cellBtn.dataset.column = columnIndex;

                let value = cell.getValue();
                if(value === null){
                    value = '';
                }
                cellBtn.textContent = value;

                boardDiv.appendChild(cellBtn);
            });
        });
    }

    function playMove(e){

        const currentPlayerName = game.getActivePlayer().name;

        const rowPos = e.target.dataset.row;
        const colPos = e.target.dataset.column;

        const position = {
            row : rowPos,
            column : colPos
        }

        game.playNewRound(position);

        //Check win condition, if it's true, return
        let checked = game.checkWinStatus();
        if(checked){
            boardDiv.textContent = '';
            playerTurnDiv.textContent = `${currentPlayerName}! \nWon this round`;
                return;
            }
        if(game.checkDraw()){
            playerTurnDiv.textContent = 'Draw!';
            boardDiv.textContent = '';
                return;
        }
        updateScreen();
    }

    function clearCellValue(){
        let reset = {
            playerToken : null
        }
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) =>{
                let cellValue = board[rowIndex][cellIndex].getValue();
                if(cellValue !== null){
                    let value = board[rowIndex][cellIndex].addToken(reset);
                }
            });
        });
        // For resetting gamePlayer to one
        game.resetPlayer();
        updateScreen();
    }
}

ScreenController();
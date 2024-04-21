function Gameboard(){

    const board = [];
    const grid = 3;

    for (let row = 0; row < grid; row++){
        board[row] = [];
        for (let column = 0; column < grid; column++){
            board[row].push(Cell());
        }
    }

    const getBoard = () => board;

    function dropTokens(player, gridObj){

        //Find the selected cell
        for(let row = 0; row < grid; row++){
            for(let column = 0; column < grid; column++){
                if(row == gridObj.row && column == gridObj.column){
                    //If cell already have a player value stop the execution
                    if(board[row][column].getValue() != null){
                        return 'break';
                    } else{
                    //Else, I have the empty cell and add player token value in it
                        board[row][column].addToken(player);
                        return 'continue';
                    }
                }
            }
        }
    }

    function printBoard(){
        let boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    }

    return {
            printBoard, 
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

    board = Gameboard();
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

    let switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0] ? players[1] : players[0]);
    };

    const getActivePlayer = () => activePlayer;

    function playNewRound(position){

        let action = board.dropTokens(activePlayer, position);

        if(action === 'break') return;
        if(action === 'continue'){
            switchPlayerTurn();
            printNewRound();
        }
    }

    function printNewRound(){
        board.printBoard();
    }

    printNewRound();

    return {
        playNewRound,
        getActivePlayer,
        getBoard: board.getBoard,
    };
}

function ScreenController(){

    //cache
    const game = gameController();

    const container = document.querySelector('.container');
    const playerTurnDiv = document.querySelector('.playerTurn');
    const boardDiv = document.querySelector('.board');
    const restart = document.querySelector('.restart');

    //EventBound
    boardDiv.addEventListener('click', playMove);
    restart.addEventListener('click', clearCellValue);

    //Render
    updateScreen();

    //Functions
    function clearCellValue(){
        let board = game.getBoard();
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) =>{
                let cellValue = board[rowIndex][cellIndex].getValue();
                if(cellValue !== null){
                    board[rowIndex][cellIndex].addToken('null');
                }
            });
        });
        updateScreen();
    }

    function playMove(e){
        const rowPos = e.target.dataset.row;
        const colPos = e.target.dataset.column;

        const position = {
            row : rowPos,
            column : colPos
        }

        game.playNewRound(position);
        updateScreen();
    }
    
    function updateScreen(){

        //Refresh board
        boardDiv.textContent = '';
        
        const board = game.getBoard();
        const currentPlayer = game.getActivePlayer().name;
        
        playerTurnDiv.textContent = `${currentPlayer} turn...`;

        //Creating board with each cell represented with btn
        //Also, included dataset to get accurate information about position when click
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellBtn = document.createElement('button');
                cellBtn.classList.add('cellBtn');

                cellBtn.dataset.row = rowIndex;
                cellBtn.dataset.column = columnIndex;

                cellBtn.textContent = cell.getValue();

                boardDiv.appendChild(cellBtn);
            });
        });
    }
}

ScreenController();
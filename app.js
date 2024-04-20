function Gameboard(){

    const board = [];
    const grid = 3;

    for (let row = 0; row < grid.length; row++){
        board[row] = [];
        for (let column = 0; column < grid.length; column++){
            board[row].push(Cell());
        }
    }

    const getBoard = () => board;

    function dropTokens(player, gridObj){

        //Find the selected cell
        for(let row = 0; row < grid; grid++){
            for(let column = 0; column < grid; column++){
                if(row == gridObj.row && column == gridObj.column){
                    //If cell already have a player value stop the execution
                    if(board[row][column].getValue() !== 0){
                        break;
                    } else{
                    //Else, I have the empty cell and add player token value in it
                        board[row][column].addToken(player);
                        break;
                    }
                }
            }
        }
    }

    function printBoard(){
        let boardWithCellValues = board.map((row) => row.map((cell) => cell.getValues()));
        console.log(boardWithCellValues);
    }

    return {
            printBoard, 
            dropTokens, 
            getBoard
        };

};

function Cell(){
    
    let value = 0;

    function addToken(player){
        value = player;
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
            playerToken : 1
        },
        {
            name : 'playerTwo',
            playerToken : 2
        }
    ]

    let activePlayer = players[0];

    let switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0] ? players[1] : players[0]);
    };

    const getActivePlayer = () => activePlayer;

    function playNewRound(gridObj){

        board.dropTokens(activePlayer, gridObj);

        switchPlayerTurn();
        printNewRound();
    }

    function printNewRound(){
        board.printBoard();
    }

    printNewRound();

    return {
        playNewRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}


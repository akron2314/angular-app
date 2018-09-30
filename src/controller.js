let game;
let board = document.getElementById("canvasBoard");
let boardCtx = board.getContext("2d");
let score = 100;
let scoreBoard = document.getElementById("score");
let food = {
    x: 0,
    y: 0,
};

let snakeArray = [
    {
        x: 200,
        y: 200,
    },
    {
        x: 190,
        y: 200,
    },
];

//snakeDir is an enum.  0 through 3 correspond to Up, Down, Left, Right in that order.
let snakeDir = 3;

function checkKeycode(e) {
    switch (e.keyCode) {
      case 38:
        snakeDir = 0;
        break;
      case 40:
        snakeDir = 1;
        break;
      case 37:
        snakeDir = 2;
        break;
      case 39:
        snakeDir = 3;
        break;
      default:
        break;
    }
}

document.onkeydown = checkKeycode;

function spawnFood() {
    let foundFreeSpace = false;
    let x = 0;
    let y = 0;
    while (!foundFreeSpace) {
        x = Math.floor(Math.random() * 391);
        y = Math.floor(Math.random() * 391);
        foundFreeSpace = true;
        let pixelArr = boardCtx.getImageData(x, y, 10, 10).data;
        let i = 1;
        while (i<pixelArr.length) {
            if (pixelArr[i] === 128) {
                foundFreeSpace = false;
            }
            i = i +4;
        }
    }
    
    boardCtx.fillStyle = "red";
    boardCtx.fillRect(x,y,10,10);
    food.x=x;
    food.y=y;
}

function gameOver() {
    //clear board
    boardCtx.clearRect(0, 0, board.width, board.height);

    //clear snakeArr
    snakeArray = [
        {
            x: 200,
            y: 200,
        },
        {
            x: 190,
            y: 200,
        },
    ];

    //re-enable start button
    document.getElementById("startBtn").disabled = false;
    
    clearInterval();

    clearInterval(game);
}
function update() {
    //use the direction enum and the head position to get where the snake is about to go
    let nextPos = Object.assign({}, snakeArray[0]);

    switch (snakeDir) {
        case 0:
            nextPos.y -= 10;
            break;
        case 1:
            nextPos.y += 10;
            break;
        case 2:
            nextPos.x -= 10;
            break;
        case 3:
            nextPos.x += 10;
            break;
        default:
            break;
    }
    
    //if that position is out of bounds or part of the snake (it will be colored green), then user lost
    if (nextPos.x<0 || nextPos.x>390 || nextPos.y<0 || nextPos.y>390) {
        gameOver();
    } else {
    
        //if nextPos is not out of bounds, get the position's data and determine if it hits food or snakebody.
        let pixelArr = boardCtx.getImageData(nextPos.x, nextPos.y, 10, 10).data;
        let i = 1;
        let foodCollision = false;
        let snakeCollision = false;
        while (i<pixelArr.length) {
            if (pixelArr[i] === 128) {
                snakeCollision = true;
                i = 401;
            } else if (pixelArr[i-1] === 255) {
                foodCollision = true;
                i = 401;
            } else {
                i = i +4;
            }
        }
    
        //if snakecollision, call the same gameover functionality
        if (snakeCollision) {
            gameOver()
        } else {
            
            //else continue the game but first...
            //if user hit food
            if (foodCollision) {
            
                //clear the food
                boardCtx.fillStyle = "cyan";
                boardCtx.fillRect(food.x, food.y,10,10);
                
                //increment score
                score++;
                scoreBoard.innerHTML = score;
                
                //spawn a new food square
                spawnFood();
            } else {
                //turn tail black
                let snakeTail = snakeArray.pop();
                boardCtx.fillStyle = "cyan";
                boardCtx.fillRect(snakeTail.x, snakeTail.y,10,10);
            }
        
        //turn nextPos green either way since snake is moving
        snakeArray.unshift(nextPos);
        boardCtx.fillStyle = "green";
        boardCtx.fillRect(nextPos.x,nextPos.y,10,10)
        
        }
    }
}

function drawSnake() {
    boardCtx.fillStyle = "green";
    for (let i = 0; i<snakeArray.length; i++) {
        boardCtx.fillRect(snakeArray[i].x,snakeArray[i].y,10,10);
    }
}

function onStart() {
    //disable the start btn
    document.getElementById("startBtn").disabled = true;
    
    //set score to 0
    score = 0;
    scoreBoard.innerHTML = score;
    
    //draw the initial snake
    drawSnake();
    
    //spawn initial food
    spawnFood();
    
    //set direction to the right in case user hit arrow keys before start
    snakeDir = 3;
    
    //start update interval
    game = setInterval(update, 80);

}
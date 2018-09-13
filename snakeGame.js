//main game elements
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var scoreText = document.querySelector('.score');
var score = 0;
var gameOver;
//snake elements
var snakeLength = 5;
var snakeSize = 10;
var snake = [];
var snakeX;
var snakeY;
var snakeSpeed = 10;
var direction = 'right';
//fruit elements
var randomX;
var randomY;
var fruitSize = 10;

//initialize the game
startGame();
//draw score
ctx.fillStyle = 'white';
ctx.font="20px Verdana";


//add listeners
canvas.addEventListener('click', resetGame);
document.addEventListener('keypress', resetGame);

//functions
function startGame() {
  scoreText.innerHTML = score;
  drawFruit();
  getSnakePosition();
  loop = setInterval(moveSnake, 50);
}

function getSnakePosition() {
  for (var i = snakeLength * snakeSpeed; i >= 0; i-=snakeSpeed) {
      snake.push({x:i, y:0});
  }
}

function moveSnake() {
  //draw scores
  ctx.fillStyle = 'grey';
  ctx.font="20px Verdana";


  snakeX = snake[0].x;
  snakeY = snake[0].y;

  if(direction == 'up') {
    snakeY -= snakeSpeed;
  }
  if(direction == 'right') {
    snakeX += snakeSpeed;
  }
  if(direction == 'left') {
    snakeX -= snakeSpeed;
  }
  if(direction == 'down') {
    snakeY += snakeSpeed;
  }


  // //snake comes back from opposite side if it passes canvas limits
  if(snakeX < 0 || snakeX > canvas.width - snakeSize || snakeY < 0 || snakeY > canvas.height - snakeSize) {
    endGame();
  }

  //if there is a collision with another part of the snake
  snake.map((element) => {
    if(element.x == snakeX && element.y == snakeY) {
      endGame();
    }
  })

  //make snake longer if eating a fruit
  console.log(snakeX == randomX && snakeY == randomY);
  if(snakeX == randomX && snakeY == randomY) {
    var tail = {x:snakeX,y:snakeY};
    score++;
    scoreText.innerHTML = score;
    drawFruit();
  } else {

    //pop out the last cell
    var tail = snake.pop();
    ctx.clearRect(tail.x-1, tail.y-1, snakeSize+2, snakeSize+2);
  }

  //put the tail as the first cell
  tail.x = snakeX;
  tail.y = snakeY;
  snake.unshift(tail);

  //draw all snake cells on canva
  for (var i = 0; i < snake.length; i++) {
      colorRectangle(snake[i].x, snake[i].y, snakeSize, snakeSize, 'white');
  }

}


function colorRectangle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x,y,width,height);
  ctx.strokeStyle = 'darkgreen';
  ctx.strokeRect(x,y,width,height);
}

function drawFruit() {
  //create random position for the fruit
  randomX = rand_10(0, canvas.width-10);
  randomY = rand_10(0, canvas.height-10);

  //check if the fruit position is similar to the snake's
  for(var i = 0; i < snake.length; i++) {
    if(snake[i].x == randomX && snake[i].y == randomY) {
      drawFruit();
    }
  }
  colorRectangle(randomX, randomY, 10, 10, 'yellow')
}



function endGame() {
  clearInterval(loop);
  ctx.fillStyle = 'black';
  ctx.fillText('GAME OVER', canvas.width/2 - 100,100);
  ctx.fillText('Your final score: ' + score, canvas.width/2 - 100,130);
  ctx.fillText('CLICK TO CONTINUE', 200, 500);
  gameOver = true;
}

function resetGame() {
  if(gameOver) {
    score = 0;
    direction = 'right';
    gameOver = false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    snakeLength = 5;
    snakeSize = 10;
    snake = [];
    direction = 'right';
    startGame();
  }
}

//touch events that changes the snake direction
document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event;
    if (e.keyCode == '38' && direction !== 'down') {
        // up arrow
        direction = 'up';
    }
    else if (e.keyCode == '40' && direction !== 'up') {
        // down arrow
        direction = 'down';
    }
    else if (e.keyCode == '37' && direction !== 'right') {
       // left arrow
       direction = 'left';
    }
    else if (e.keyCode == '39' && direction !== 'left') {
       // right arrow
       direction = 'right';
    }
}

//randomize multiples of 10 between min and max values
function rand_10(min, max){
    return Math.round((Math.random()*(max-min)+min)/10)*10;
}

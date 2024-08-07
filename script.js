const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverVideo = document.getElementById('gameOverVideo');
const startButton = document.getElementById('startButton');

// Ball properties
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 3,
    dy: -3
};

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 10;
let paddle = {
    x: (canvas.width - paddleWidth) / 2,
    y: canvas.height - paddleHeight - 10,
    width: paddleWidth,
    height: paddleHeight,
    dx: 5
};

// Control paddle movement
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'ArrowLeft') leftPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'ArrowLeft') leftPressed = false;
});

// Tile properties
const tileWidth = 80;
const tileHeight = 20;
const tilePadding = 10;
const tileOffsetTop = 30;
const tileOffsetLeft = 30;

const tiles = [];
const rowCount = 5;
const columnCount = 7;

let tilesLeft = rowCount * columnCount;
let gameOver = false;
let score = 0;
let level = 1;
let lives = 3; // Number of lives
let levelTileRows = rowCount;
let levelTileColumns = columnCount;

function createTiles() {
    tiles.length = 0; // Clear the tiles array
    for (let c = 0; c < levelTileColumns; c++) {
        tiles[c] = [];
        for (let r = 0; r < levelTileRows; r++) {
            const x = c * (tileWidth + tilePadding) + tileOffsetLeft;
            const y = r * (tileHeight + tilePadding) + tileOffsetTop;
            tiles[c][r] = { x, y, status: 1 };
        }
    }
    tilesLeft = levelTileRows * levelTileColumns;
}

function drawTiles() {
    for (let c = 0; c < levelTileColumns; c++) {
        for (let r = 0; r < levelTileRows; r++) {
            if (tiles[c][r].status === 1) {
                const { x, y } = tiles[c][r];
                ctx.beginPath();
                ctx.rect(x, y, tileWidth, tileHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < levelTileColumns; c++) {
        for (let r = 0; r < levelTileRows; r++) {
            const tile = tiles[c][r];
            if (tile.status === 1) {
                if (ball.x > tile.x && ball.x < tile.x + tileWidth && ball.y > tile.y && ball.y < tile.y + tileHeight) {
                    ball.dy = -ball.dy;
                    tile.status = 0;
                    tilesLeft--;
                    score += 10; // Increase score for each tile hit
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000'; // Set ball color to black
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#000'; // Set paddle color to black
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 8, 20);
}

function drawLevel() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'right';
    ctx.fillText('Level: ' + level, canvas.width - 8, 20);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText('Lives: ' + lives, canvas.width / 2, 20);
}

function showGameOver(message) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '48px Arial';
    ctx.fillStyle = '#ff0000';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    
    // Hide the canvas and show the video
    canvas.style.display = 'none';
    gameOverVideo.style.display = 'block';
    gameOverVideo.play();
}

function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5; // Reset to original speed
    ball.dy = -5; // Reset to original speed
    paddle.x = (canvas.width - paddleWidth) / 2;
    paddle.y = canvas.height - paddleHeight - 10;
    score = 0;
    createTiles();
}

function advanceLevel() {
    level++;
    levelTileRows += 1; // Add more rows for the new level
    levelTileColumns += 1; // Add more columns for the new level
    resetGame(); // Reset the game state for the new level
    ball.dx *= 1.1; // Increase ball speed slightly
    ball.dy *= 1.1; // Increase ball speed slightly
}

function update() {
    if (gameOver) return; // Stop updating if the game is over

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Ball collision with paddle
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else {
            lives--; // Decrease lives when the ball falls below the paddle
            if (lives > 0) {
                resetGame(); // Reset game state and allow the player to try again
            } else {
                gameOver = true;
                showGameOver('Game Over! Final Score: ' + score);
            }
        }
    }

    // Paddle movement
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.dx;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }

    // Tile collision detection
    collisionDetection();

    // Check if the game is won
    if (tilesLeft === 0) {
        advanceLevel();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff'; // Set background color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with white
    drawTiles();
    drawBall();
    drawPaddle();
    drawScore();
    drawLevel();
    drawLives();
    update();
}

let gameLoopId;

function gameLoop() {
    if (!gameOver) {
        draw();
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    gameOverVideo.style.display = 'none';
    resetGame();
    createTiles();
    gameLoop();
}

startButton.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'l') {
        const command = prompt('Enter cheat command:').trim().toLowerCase();
        cheatCommand(command);
    }
});

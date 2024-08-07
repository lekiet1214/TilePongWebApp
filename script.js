const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball properties
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 2,
    dy: -2
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

function createTiles() {
    for (let c = 0; c < columnCount; c++) {
        tiles[c] = [];
        for (let r = 0; r < rowCount; r++) {
            const x = c * (tileWidth + tilePadding) + tileOffsetLeft;
            const y = r * (tileHeight + tilePadding) + tileOffsetTop;
            tiles[c][r] = { x, y, status: 1 };
        }
    }
}

function drawTiles() {
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
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
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            const tile = tiles[c][r];
            if (tile.status === 1) {
                if (ball.x > tile.x && ball.x < tile.x + tileWidth && ball.y > tile.y && ball.y < tile.y + tileHeight) {
                    ball.dy = -ball.dy;
                    tile.status = 0;
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function update() {
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
            // Reset ball position if it falls below the paddle
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = 2;
            ball.dy = -2;
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
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTiles();
    drawBall();
    drawPaddle();
    update();
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

createTiles();
gameLoop();

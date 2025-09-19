// Game configuration
const GRID_SIZE = 20;
const BOARD_SIZE = 400;
const CELL_SIZE = BOARD_SIZE / GRID_SIZE;

// Game state
let snake = [];
let food = {};
let direction = 'right';
let gameLoop;
let score = 0;

// Initialize game board
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');

function startGame() {
    // Reset game state
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    
    // Clear existing elements
    gameBoard.innerHTML = '';
    
    // Generate initial food
    generateFood();
    
    // Clear existing game loop and start new one
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, 150);
}

function gameStep() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (checkFoodCollision()) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        // Remove tail if no food was eaten
        snake.pop();
    }
    drawGame();
}

function moveSnake() {
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    snake.unshift(head);
}

function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        
        // Check if food spawned on snake
        let onSnake = false;
        for (const segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                onSnake = true;
                break;
            }
        }
        
        if (!onSnake) break;
    }
}

function drawGame() {
    gameBoard.innerHTML = '';
    
    // Draw snake
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.className = 'snake-segment';
        snakeElement.style.left = segment.x * CELL_SIZE + 'px';
        snakeElement.style.top = segment.y * CELL_SIZE + 'px';
        gameBoard.appendChild(snakeElement);
    });
    
    // Draw food
    const foodElement = document.createElement('div');
    foodElement.className = 'food';
    foodElement.style.left = food.x * CELL_SIZE + 'px';
    foodElement.style.top = food.y * CELL_SIZE + 'px';
    gameBoard.appendChild(foodElement);
}

function endGame() {
    clearInterval(gameLoop);
    alert('Game Over! Score: ' + score);
}

// Handle keyboard controls
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});
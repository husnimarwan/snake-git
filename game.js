// Game configuration
const GRID_SIZE = 20;
const BOARD_SIZE = window.innerWidth <= 600 ? 300 : 400;
const CELL_SIZE = BOARD_SIZE / GRID_SIZE;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

// Game state
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameLoop;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let isPaused = false;
let currentSpeed = INITIAL_SPEED;

// Initialize game board and UI elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreElement = document.getElementById('finalScore');
const finalHighScoreElement = document.getElementById('finalHighScore');
const pauseBtn = document.getElementById('pauseBtn');

// Update high score display
highScoreElement.textContent = highScore;

function startGame() {
    // Reset game state
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    currentSpeed = INITIAL_SPEED;
    isPaused = false;
    
    // Update UI
    scoreElement.textContent = score;
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    gameOverOverlay.classList.add('hidden');
    
    // Clear existing elements
    gameBoard.innerHTML = '';
    
    // Generate initial food
    generateFood();
    
    // Clear existing game loop and start new one
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, currentSpeed);
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
    // Update direction from nextDirection
    direction = nextDirection;
    
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
    
    // Update high score if necessary
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
    }
    
    // Show game over overlay
    finalScoreElement.textContent = score;
    finalHighScoreElement.textContent = highScore;
    gameOverOverlay.classList.remove('hidden');
}

// Handle keyboard controls
document.addEventListener('keydown', event => {
    if (event.key === ' ' || event.key === 'Escape') {
        togglePause();
        return;
    }
    
    if (!isPaused) {
        switch (event.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'arrowdown':
            case 's':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'arrowleft':
            case 'a':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'arrowright':
            case 'd':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    }
});

// Handle mobile controls
function handleDirection(dir) {
    if (!isPaused) {
        switch (dir) {
            case 'up':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'down':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'left':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'right':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    }
}

// Toggle pause state
function togglePause() {
    if (!gameLoop) return; // Don't pause if game hasn't started
    
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoop);
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    } else {
        gameLoop = setInterval(gameStep, currentSpeed);
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
}

// Reset high score to zero
function resetHighScore() {
    highScore = 0;
    localStorage.setItem('snakeHighScore', highScore);
    highScoreElement.textContent = highScore;
    // Also reset the display in the game over overlay if visible
    if (!gameOverOverlay.classList.contains('hidden')) {
        finalHighScoreElement.textContent = highScore;
    }
}
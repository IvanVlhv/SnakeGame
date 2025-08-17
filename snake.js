const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const scoreboard = document.getElementById('scoreboard');
const highScoresList = document.getElementById('high-scores');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const maxSnakeLength = tileCount * tileCount;
let snake, direction, food, score, gameInterval;

function initGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = { x: 5, y: 5 };
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  gameOverDisplay.style.display = 'none';
  scoreboard.style.display = 'none';

  clearInterval(gameInterval);
  gameInterval = setInterval(draw, 150);
}
function drawGrid() {
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
}

function drawFood() {
  const x = food.x * gridSize + gridSize / 2;
  const y = food.y * gridSize + gridSize / 2;

  ctx.fillStyle = '#f00';
  ctx.beginPath();
  ctx.arc(x, y, gridSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0a0';
  ctx.beginPath();
  ctx.moveTo(x, y - gridSize / 2);
  ctx.lineTo(x + gridSize * 0.2, y - gridSize * 0.7);
  ctx.lineTo(x - gridSize * 0.2, y - gridSize * 0.7);
  ctx.fill();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;

    ctx.fillStyle = index === 0 ? '#0a0' : '#0f0';
    ctx.fillRect(x, y, gridSize, gridSize);

    if (index === 0) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + gridSize * 0.2, y + gridSize * 0.2, gridSize * 0.2, gridSize * 0.2);
      ctx.fillRect(x + gridSize * 0.6, y + gridSize * 0.2, gridSize * 0.2, gridSize * 0.2);
    }
  });
}


function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();

  // Move snake
  const head = {
    x: (snake[0].x + direction.x + tileCount) % tileCount,
    y: (snake[0].y + direction.y + tileCount) % tileCount,
  };
  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } else {
    snake.pop();
  }

  drawSnake();

  // Check self-collision
  if (snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
    endGame('Game Over');
  }

  // Check win condition
  if (snake.length >= maxSnakeLength) {
    endGame('You Win!');
  }
}

function endGame(message) {
  clearInterval(gameInterval);
  gameOverDisplay.style.display = 'block';
  gameOverDisplay.firstChild.textContent = message;

  let scores = JSON.parse(localStorage.getItem('scores') || '[]');
  scores.push(score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem('scores', JSON.stringify(scores));

  highScoresList.innerHTML = '';
  scores.forEach((s) => {
    const li = document.createElement('li');
    li.textContent = s;
    highScoresList.appendChild(li);
  });
  scoreboard.style.display = 'block';
}

function restartGame() {
  initGame();
}

function changeDirection(e) {
  switch (e.key) {
    case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
    case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
    case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
    case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
  }
}

document.addEventListener('keydown', changeDirection);
initGame();


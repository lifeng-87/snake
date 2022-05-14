const BLOCK_SIZE = 30;
const BLOCK_COUNT = 20;

var gameInterval;

var snake;
var apple;
var score;
var control;

window.onload = onPageLoaded;

function onPageLoaded() {
	var canvas = document.getElementById("canvas_id");
	var ctx = canvas.getContext("2d");

	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	document.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(event) {
	//左:37 上:38 右:39 下:40
	switch (event.keyCode) {
		case 37:
			if (snake.dircetion.x === 1 && snake.dircetion.y === 0) {
				return;
			}
			setContral({ x: -1, y: 0 });
			break;
		case 38:
			if (snake.dircetion.x === 0 && snake.dircetion.y === 1) {
				return;
			}
			setContral({ x: 0, y: -1 });
			break;
		case 39:
			if (snake.dircetion.x === -1 && snake.dircetion.y === 0) {
				return;
			}
			setContral({ x: 1, y: 0 });
			break;
		case 40:
			if (snake.dircetion.x === 0 && snake.dircetion.y === -1) {
				return;
			}
			setContral({ x: 0, y: 1 });
			break;
	}
}

function gameStart() {
	if (gameInterval) {
		clearInterval(gameInterval);
	}
	setSnake({
		body: [{ x: BLOCK_COUNT / 2, y: BLOCK_COUNT / 2 }],
		size: 5,
		dircetion: { x: 0, y: -1 },
	});
	setContral(snake.dircetion);
	putApple();
	updateScore(0);
	gameInterval = setInterval(gameRoutine, 100);
}

function setContral(newContral) {
	control = newContral;
}

function gameRoutine() {
	snake.dircetion = control;
	if (moveSnake()) return;
	checkEatApple();
	updateCanvas();
}

function updateCanvas() {
	var canvas = document.getElementById("canvas_id");
	var ctx = canvas.getContext("2d");

	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < snake.body.length; i++) {
		ctx.fillStyle = "lime";
		ctx.fillRect(
			snake.body[i].x * BLOCK_SIZE,
			snake.body[i].y * BLOCK_SIZE,
			BLOCK_SIZE - 1,
			BLOCK_SIZE - 1
		);
	}

	ctx.fillStyle = "red";
	ctx.fillRect(apple.x * BLOCK_SIZE, apple.y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

function setSnake(newSnake) {
	snake = newSnake;
}

function moveSnake() {
	var newBlock = {
		x: snake.body[0].x + snake.dircetion.x,
		y: snake.body[0].y + snake.dircetion.y,
	};

	snake.body.unshift(newBlock);

	while (snake.body.length > snake.size) {
		snake.body.pop();
	}

	return checkSnakeState();
}

function checkSnakeState() {
	if (snakeIsDead()) {
		gameOver();
		return true;
	}
	return false;
}

function snakeIsDead() {
	if (
		snake.body[0].x < 0 ||
		snake.body[0].x >= BLOCK_COUNT ||
		snake.body[0].y < 0 ||
		snake.body[0].y >= BLOCK_COUNT
	) {
		return true;
	}

	for (var i = 1; i < snake.body.length; i++) {
		if (snake.body[0].x === snake.body[i].x && snake.body[0].y === snake.body[i].y) {
			return true;
		}
	}

	return false;
}

function gameOver() {
	clearInterval(gameInterval);
	alert("Game Over");
}

function putApple() {
	apple = {
		x: Math.floor(Math.random() * BLOCK_COUNT),
		y: Math.floor(Math.random() * BLOCK_COUNT),
	};

	for (var i = 0; i < snake.body.length; i++) {
		if (snake.body[i].x === apple.x && snake.body[i].y === apple.y) {
			putApple();
			break;
		}
	}
}

function checkEatApple() {
	if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
		eatApple();
	}
}

function eatApple() {
	snake.size += 1;
	putApple();
	updateScore(score + 1);
}

function updateScore(newScore) {
	score = newScore;
	document.getElementById("score_id").innerHTML = `Score: ${score}`;
}

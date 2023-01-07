const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreEl = document.querySelector('.score');
const startBtn = document.querySelector('.btn-start');
const newGameBtn = document.querySelector('.btn-new-game');
const miniGrid = document.querySelector('.mini-grid');
let miniGridSquares = Array.from(document.querySelectorAll('.mini-grid div'));
const width = 10;
let currentPosition,
  currentRotation,
  current,
  random,
  intervalID,
  score = 0,
  nextRandom = 0;

const colors = ['#67760e', '#fcb001', '#214048', '#aca79e', '#ff3331'];

const lFigure = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zFigure = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tFigure = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oFigure = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iFigure = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const figureArr = [lFigure, zFigure, tFigure, oFigure, iFigure];

const init = function () {
  currentPosition = 4;
  random = Math.floor(Math.random() * figureArr.length);
  currentRotation = 0;
  current = figureArr[random][currentRotation];
  window.addEventListener('keydown', keys);
  draw();
  drawMiniGrid();
  fall();
};

const draw = function () {
  current.forEach(e => {
    squares[currentPosition + e].classList.add('tetrisFigure');
    squares[currentPosition + e].style.backgroundColor = colors[nextRandom];
  });
};

const undraw = function () {
  current.forEach(e => {
    squares[currentPosition + e].classList.remove('tetrisFigure');
    squares[currentPosition + e].style.backgroundColor = '';
  });
};

const keys = function (e) {
  const keyPressed = e.code;
  e.preventDefault();

  //when arrow down is pressed move tetris figure down
  if (keyPressed === 'ArrowDown') {
    moveDown();
  }
  //when left arrow is pressed move teris figure left
  if (keyPressed === 'ArrowLeft') {
    moveLeft();
  }
  //when right arrow is pressed move tetris firgure right
  if (keyPressed === 'ArrowRight') {
    moveRight();
  }
  //when spacebar pressed then rotate tetris tile
  if (keyPressed === 'Space') {
    rotate();
  }
};

const moveDown = function () {
  undraw();
  currentPosition += width;
  draw();
  freeze();
};

const moveRight = function () {
  const isAtRightEdge = current.some(
    index => (currentPosition + index + 1) % width === 0
  );
  undraw();
  if (!isAtRightEdge) currentPosition += 1;
  if (
    current.some(e =>
      squares[currentPosition + e + width].classList.contains('taken')
    )
  )
    currentPosition -= 1;
  draw();
};

const moveLeft = function () {
  const isAtLeftEdge = current.some(
    index => (currentPosition + index) % width === 0
  );
  undraw();
  if (!isAtLeftEdge) currentPosition -= 1;
  if (
    current.some(e =>
      squares[currentPosition + e + width].classList.contains('taken')
    )
  )
    currentPosition += 1;
  draw();
};

const freeze = function () {
  if (
    current.some(e =>
      squares[currentPosition + e + width].classList.contains('taken')
    )
  ) {
    current.forEach(e => squares[currentPosition + e].classList.add('taken'));
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * figureArr.length);
    currentRotation = 0;
    current = figureArr[random][currentRotation];
    currentPosition = 4;
    scoreAdd();
    draw();
    undrawMiniGrid();
    drawMiniGrid();

    gameOver();
  }
};

const rotate = function () {
  undraw();
  currentRotation++;
  if (currentRotation === current.length) currentRotation = 0;
  current = figureArr[random][currentRotation];
  checkRotatedPosition();
  draw();
};

const checkRotatedPosition = function (P) {
  P = P || currentPosition;
  if ((P + 1) % width < 4) {
    //add 1 because the position index can be 1 less than where the piece is
    if (isOnRight()) {
      currentPosition += 1; //if so, add one to wrap it back around
      checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
    }
  } else if (P % width > 5) {
    if (isOnLeft()) {
      currentPosition -= 1;
      checkRotatedPosition(P);
    }
  }
};

const isOnLeft = function () {
  return current.some(index => (currentPosition + index) % width === 0);
};

const isOnRight = function () {
  return current.some(index => (currentPosition + index + 1) % width === 0);
};

const fall = function () {
  intervalID = setInterval(moveDown, 1000);
};

const scoreAdd = function () {
  for (let i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every(e => squares[e].classList.contains('taken'))) {
      score++;
      scoreEl.innerHTML = score;

      row.forEach(e => {
        squares[e].classList.remove('tetrisFigure');
        squares[e].classList.remove('taken');
        squares[e].style.backgroundColor = '';
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
    }
  }
};

const gameOver = function () {
  if (
    current.some(index =>
      squares[currentPosition + index].classList.contains('taken')
    )
  ) {
    clearInterval(intervalID);
    window.removeEventListener('keydown', keys);
  }
};

startBtn.addEventListener('click', () => {
  if (intervalID) {
    clearInterval(intervalID);
    intervalID = null;
  } else {
    draw();
    intervalID = setInterval(moveDown, 1000);
    nextRandom = Math.floor(Math.random() * figureArr.length);
  }
});

newGameBtn.addEventListener('click', () => {
  squares.forEach(e => {
    e.classList.remove('tetrisFigure');
    e.style.backgroundColor = '';
  });

  squares.forEach(e => {
    if (!e.classList.contains('hidden')) {
      e.classList.remove('taken');
    }
  });

  if (squares.forEach(e => e.classList.contains('hidden'))) current = 0;

  score = 0;
  scoreEl.innerHTML = 0;
  clearInterval(intervalID);
  intervalID = null;

  init();
});

// mini grid
let miniWidth = 4;
let miniPosition = 0;
const miniFigures = [
  [1, miniWidth + 1, miniWidth * 2 + 1, 2], //L figure
  [0, miniWidth, miniWidth + 1, miniWidth * 2 + 1], //Z figure
  [1, miniWidth, miniWidth + 1, miniWidth + 2], //T figure
  [0, 1, miniWidth, miniWidth + 1], //o figure
  [1, miniWidth + 1, miniWidth * 2 + 1, miniWidth * 3 + 1],
];
let currentMiniFigures = miniFigures[nextRandom];
const drawMiniGrid = function () {
  currentMiniFigures = miniFigures[nextRandom];
  currentMiniFigures.forEach(e =>
    miniGridSquares[miniPosition + e].classList.add('tetrisFigure')
  );
};

const undrawMiniGrid = function () {
  currentMiniFigures.forEach(e =>
    miniGridSquares[miniPosition + e].classList.remove('tetrisFigure')
  );
};

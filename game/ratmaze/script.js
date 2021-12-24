const ratmazeContainer = document.querySelector('.ratmaze-container');
const ratmaze = document.querySelector('.ratmaze');
const model = document.querySelector('.overlay-model');
const overlay = document.querySelector('.overlay');
const modelContent = document.querySelector('.overlay-model-content');
const closeModelBtn = document.querySelector('.close-model--btn');
const nextBtn = document.querySelector('.next--btn');
const prevBtn = document.querySelector('.prev--btn');
const instructionBtn = document.querySelector('.instruction--btn');
const currentLevel = document.querySelector('.level.start');
const finalLevel = document.querySelector('.level.final');

const aboutGame = `
	<p>In this game you have to find a path from starting position to the finishing position.</p>\n
	<p><kbd>&larr;</kbd>&nbsp;&nbsp;Move <b>Left</b> by one position</p>
	<p><kbd>&uarr;</kbd>&nbsp;&nbsp;Move <b>Up</b> by one position</p>
	<p><kbd>&darr;</kbd>&nbsp;&nbsp;Move <b>Down</b> by one position</p>
	<p><kbd>&rarr;</kbd>&nbsp;&nbsp;Move <b>Right</b> by one position</p>
`;

const openModel = function (e) {
  e?.preventDefault();
  overlay.classList.remove('hidden');
  model.classList.remove('hidden');
};

const closeModel = function (e) {
  e?.preventDefault();
  overlay.classList.add('hidden');
  model.classList.add('hidden');
};

closeModelBtn.addEventListener('click', closeModel);
document.body.addEventListener(
  'keydown',
  e => e.key === 'Escape' && !model.classList.contains('hidden') && closeModel()
);

instructionBtn.addEventListener('click', function () {
  modelContent.innerHTML = aboutGame;
  openModel();
});

const mazeLevels = [
  {
    maze: [1, 1, 0, 0, 1, 0, 1, 1, 1],
    dimension: 3,
  },
  {
    maze: [1, 0, 1, 1, 1, 0, 0, 1, 1],
    dimension: 3,
  },
  {
    maze: [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1],
    dimension: 4,
  },
  {
    maze: [
      1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1,
    ],
    dimension: 5,
  },
  {
    maze: [
      1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1,
      0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1,
    ],
    dimension: 6,
  },
];

const totalLevels = mazeLevels.length;
finalLevel.textContent = totalLevels;

let currLevel; // 0 index based
let levelLog; // Keep note which level has been completed

const formatLevelLog = val => val.split(',').map(v => +v); // converts "0,0,0,0" to [0,0,0,0]

// find the last level which was completed and return the next level
const findLastCompletedLevel = () =>
  levelLog.lastIndexOf(1) === totalLevels - 1 ? 0 : levelLog.lastIndexOf(1) + 1;

// Store current level in local storage
if (localStorage.getItem('ratmaze-levellog')) {
  levelLog = formatLevelLog(localStorage.getItem('ratmaze-levellog'));
} else {
  levelLog = Array.from({ length: totalLevels }, () => 0);
  localStorage.setItem('ratmaze-levellog', levelLog);
}

currLevel = findLastCompletedLevel();

let currMaze, currDimension;
let i,
  j,
  solved,
  start = false;

const calcIndex = (x, y, dim) => x * dim + y;

const gameStart = () => start;

function setGameLevelButton() {
  if (currLevel === 0) prevBtn.style.display = 'none';
  else prevBtn.style.display = 'block';

  if (currLevel === totalLevels - 1) nextBtn.style.display = 'none';
  else nextBtn.style.display = 'block';
}

const init = function (currLevel) {
  (i = 0), (j = 0);
  solved = false;

  currentLevel.textContent = currLevel + 1;
  ratmaze.innerHTML = '';

  const { maze, dimension } = mazeLevels[currLevel];
  currMaze = maze;
  currDimension = dimension;

  setGameLevelButton();
};

const play = function (currLevel) {
  init(currLevel);

  const constructMaze = function (level) {
    for (let m = 0; m < currDimension; m++) {
      let row_html = `<div class="d-flex">`;
      let col_html = '';
      for (let n = 0; n < currDimension; n++) {
        col_html += `<div class="maze ${
          currMaze[calcIndex(m, n, currDimension)] ? 'path' : 'block'
        } ${m === 0 && n === 0 && 'active start'} ${
          m === currDimension - 1 && n === currDimension - 1 && 'finish'
        }" data-row="${m}" data-col="${n}" data-matrix="${m}-${n}"></div>`;
      }
      row_html += col_html;
      row_html += `</div>`;
      ratmaze.innerHTML += row_html;
    }

    const setMazeSize = (elem, size) =>
      (elem.style.width = elem.style.height = size);

    const mazeDivs = [...document.getElementsByClassName('maze')];
    mazeDivs?.forEach(maze => {
      if (currDimension <= 4) setMazeSize(maze, '80px');
      else if (currDimension === 5) setMazeSize(maze, '75px');
      else if (currDimension === 6) setMazeSize(maze, '67px');
      else setMazeSize(maze, '58px');
    });

    start = mazeDivs ? true : false; // start game (activate keyboard events)
  };
  constructMaze();
};

const checkMove = function (x, y) {
  if (x >= currDimension || x < 0 || y >= currDimension || y < 0) return 0;
  if (currMaze[calcIndex(x, y, currDimension)]) return 1; // if there is a path
  return 0; // there is no path
};

const updateActiveClass = function (prev_i, prev_j, next_i, next_j) {
  document
    .querySelector(`.maze[data-matrix="${prev_i}-${prev_j}"]`)
    .classList.remove('active');
  document
    .querySelector(`.maze[data-matrix="${next_i}-${next_j}"]`)
    .classList.add('active');
};

const solvedMaze = function (x, y) {
  if (x === currDimension - 1 && y === currDimension - 1) return true;
  return false;
};

document.body.addEventListener('keydown', function (e) {
  if (gameStart() && !solved) {
    if (e.key === 'ArrowLeft') {
      if (checkMove(i, j - 1)) updateActiveClass(i, j, i, --j);
    } else if (e.key === 'ArrowRight') {
      if (checkMove(i, j + 1)) updateActiveClass(i, j, i, ++j);
    } else if (e.key === 'ArrowUp') {
      if (checkMove(i - 1, j)) updateActiveClass(i, j, --i, j);
    } else if (e.key === 'ArrowDown') {
      if (checkMove(i + 1, j)) updateActiveClass(i, j, ++i, j);
    }

    solved = solvedMaze(i, j);
    if (solved) {
      levelLog[currLevel] = 1; // Mark that level as completed
      localStorage.setItem('ratmaze-levellog', levelLog);

      setTimeout(function () {
        const winMessage = `<p>You found a way!!!✌✌</p><p>${
          currLevel === totalLevels - 1
            ? '<p><b>Yahoo!!</b> You have completed all the levels'
            : 'You can proceed to the <b>next level</b>'
        }.</p>`;
        modelContent.innerHTML = winMessage;
        openModel();
      }, 200);
    }
  }
});

play(currLevel);

nextBtn.addEventListener('click', function (e) {
  e.preventDefault();
  this.blur();

  if (levelLog[currLevel] || solved) {
    currLevel += 1;
    if (currLevel >= totalLevels) currLevel = totalLevels - 1;

    play(currLevel);
  }
});

prevBtn.addEventListener('click', function (e) {
  e.preventDefault();
  this.blur();

  currLevel -= 1;
  if (currLevel < 0) currLevel = 0;

  play(currLevel);
});

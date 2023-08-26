const singlePlayerButton = document.getElementById('singlePlayerButton');
const firstButton = document.getElementById('firstButton');
const secondButton = document.getElementById('secondButton');
const orderSelection = document.getElementById('orderSelection');

singlePlayerButton.addEventListener('click', () => {
  orderSelection.style.display = 'block';
});



firstButton.addEventListener('click', () => {
  orderSelection.style.display = 'none';
  startSinglePlayerGame(true); // User goes first
});

secondButton.addEventListener('click', () => {
  orderSelection.style.display = 'none';
  startSinglePlayerGame(false); // AI goes first
});



const player1Label = document.getElementById('player1');
const player2Label = document.getElementById('player2');

const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameActive = false; // Initialize as false

let aiPlayer = 'O'; // AI player will be 'O'
let humanPlayer = 'X'; // Human player will be 'X'


const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function updatePlayerLabels() {
  player1Label.classList.toggle('active', currentPlayer === 'X');
  player2Label.classList.toggle('active', currentPlayer === 'O');
}

function checkWin() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      return combination;
    }
  }
  return null;
}


function startSinglePlayerGame(userGoesFirst) {
  currentPlayer = userGoesFirst ? humanPlayer : aiPlayer;
  player1Label.innerHTML = `<i class="fas fa-microchip"></i> <i class="fas fa-arrow-right"></i> <span class="bold-x">${humanPlayer}</span>`;
  player2Label.innerHTML = `<i class="fas fa-user"></i> <i class="fas fa-arrow-right"></i> <span class="bold-o">${aiPlayer}</span>`;
  player2Label.classList.add('active');
  gameActive = true;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.removeEventListener('click', makeMove); // Remove old listener
    cell.addEventListener('click', makeMoveSinglePlayer); // Add new listener
  });
}


function makeMoveSinglePlayer(event) {
  const cell = event.target;
  makeMove(cell);

  if (currentPlayer === humanPlayer && gameActive) {
    cells.forEach(cell => cell.removeEventListener('click', makeMoveSinglePlayer));

    setTimeout(() => {
      const bestMove = getBestMove();
      const aiCell = cells[bestMove];
      makeMove(aiCell);

      cells.forEach(cell => {
        if (cell.textContent === '') {
          cell.addEventListener('click', makeMoveSinglePlayer);
        }
      });
    }, 500); // Delay AI move for half a second
  }
}


/*function makeMove(cell) {
  const index = parseInt(cell.getAttribute('data-index'));
  if (cell.textContent === '' && gameActive) {
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    if (checkWin()) {
      gameActive = false;
      alert(`Player ${currentPlayer} wins!`);
    } else if ([...cells].every(cell => cell.textContent !== '')) {
      gameActive = false;
      alert("It's a draw!");
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updatePlayerLabels();
    }
  }
}*/

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent === '') {
      cells[i].textContent = aiPlayer;
      let score = minimax(cells, 0, false);
      cells[i].textContent = '';

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

const scores = {
  X: -1,
  O: 1,
  draw: 0
};

function minimax(board, depth, isMaximizing) {
  let result = checkResult();
  
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].textContent === '') {
        cells[i].textContent = aiPlayer;
        let score = minimax(board, depth + 1, false);
        cells[i].textContent = '';
        maxScore = Math.max(maxScore, score);
      }
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].textContent === '') {
        cells[i].textContent = humanPlayer;
        let score = minimax(board, depth + 1, true);
        cells[i].textContent = '';
        minScore = Math.min(minScore, score);
      }
    }
    return minScore;
  }
}

function checkResult() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
      return cells[a].textContent;
    }
  }

  if ([...cells].every(cell => cell.textContent !== '')) {
    return 'draw';
  }

  return null;
}


function makeMove(cell) {
  const index = parseInt(cell.getAttribute('data-index'));
  if (cell.textContent === '' && gameActive) {
    cell.textContent = currentPlayer;
    const winningCombination = checkWin(); // Check for win after making a move

    if (winningCombination) {
      gameActive = false;

      // Display win message inside the container
      const winMessage = document.getElementById('winMessage');

      if (currentPlayer === humanPlayer) {
        winMessage.innerHTML = `<i class="fas fa-microchip"></i> <span class="win-message-text">A.I. wins!</span>`;
      } else {
        winMessage.innerHTML = `<i class="fas fa-user"></i> <span class="win-message-text">Human wins!</span>`;
      }

      winMessage.classList.add('win'); // Add 'win' class for styling

      // Apply the winning line style to the winning combination cells
      for (const index of winningCombination) {
        cells[index].classList.add('winning-cell');
      }
    } else if ([...cells].every(cell => cell.textContent !== '')) {
      gameActive = false;

      // Display draw message inside the container
      const winMessage = document.getElementById('winMessage');
      winMessage.innerHTML = `<span class="win-message-text">It's a draw!</span>`;
      winMessage.classList.add('draw'); // Add 'draw' class for styling
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updatePlayerLabels();
    }
  }
}






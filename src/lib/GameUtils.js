/**
 * Check if there is a winner in the current state of the game
 * @param tiles
 * @returns {string|boolean} - returns 'x' if the player wins, 'o' if the AI wins, or false if no winner
 */
const getWinner = (tiles) => {
  const patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let pattern of patterns) {
    const [a, b, c] = pattern;
    if (tiles[a] !== 'e' && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      return tiles[a];
    }
  }
  return false;
};

/**
 * Minimax algorithm to evaluate the optimal move
 * @param tiles - the current board state
 * @param isMaximizing - boolean to differentiate between maximizing and minimizing turn
 * @returns {number} - the score for the current board state
 */
const minimax = (tiles, isMaximizing) => {
  const winner = getWinner(tiles);
  if (winner === 'x') return -1; // Player wins
  if (winner === 'o') return 1; // AI wins
  if (!tiles.includes('e')) return 0; // Tie

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] === 'e') {
        tiles[i] = 'o';
        const score = minimax(tiles, false);
        tiles[i] = 'e';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] === 'e') {
        tiles[i] = 'x';
        const score = minimax(tiles, true);
        tiles[i] = 'e';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

/**
 * Find the best move for the AI using the minimax algorithm
 * @param tiles - the current board state
 * @returns {number} - the index of the best move
 */
const findBestMove = (tiles) => {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === 'e') {
      tiles[i] = 'o';
      const score = minimax(tiles, false);
      tiles[i] = 'e';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

/**
 * Get a random available move
 * @param tiles
 * @returns {number} - index of a random empty tile
 */
const getRandomMove = (tiles) => {
  const availableMoves = tiles
    .map((tile, index) => (tile === 'e' ? index : null))
    .filter((index) => index !== null);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

/**
 * Choose the best move based on difficulty level
 * @param tiles
 * @param difficulty - 'easy', 'medium', or 'hard'
 * @returns {number} - index of the best move
 */
const chooseMove = (tiles, difficulty) => {
  if (difficulty === 'easy') {
    return getRandomMove(tiles); // AI chooses a random move
  } else if (difficulty === 'medium') {
    // 50% chance of choosing the best move, 50% chance of random move
    return Math.random() < 0.5 ? findBestMove(tiles) : getRandomMove(tiles);
  } else {
    // Hard mode: always choose the best move
    return findBestMove(tiles);
  }
};

export default {
  /**
   * Get the best move for the AI based on the chosen difficulty
   * @param tiles - the current board state
   * @param difficulty - 'easy', 'medium', or 'hard'
   * @returns {number} - the index of the best move or -1 if no move is possible
   */
  AI: (tiles, difficulty = 'hard') => {
    const bestMove = chooseMove(tiles, difficulty);
    return bestMove !== -1 ? bestMove : -1;
  },
  getWinner,
};

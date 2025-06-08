export const AI_LEVELS = {
  0: 'Dull',
  1: 'Smart',
  2: 'Brilliant',
  3: '2 Player Mode',
};

export const STATE_KEYS = {
  CURRENT_GAME: 'currentGame',
  STARTING_PLAYER: 'startingPlayer',
  CURRENT_PLAYER: 'currentPlayer',
  OPPONENT_LEVEL: 'opponentLevel',
  GAME_BOARD: 'gameBoard',
  GAME_OVER: 'gameOver',
  WINNER: 'winner',
  GAME_IN_PROGRESS: 'gameInProgress',
  PLAYER_X_SCORE: 'playerXScore',
  PLAYER_O_SCORE: 'playerOScore',
};

export const GAME = {
  TIC_TAC_TOE: "Tic-Tac-Toe",
  CONNECT_FOUR: "Connect Four",
  TIC_TAC_TOE_TITLE_ELEMENT: "<h3>Tic Tac Toe</h3>", 
  CONNECT_FOUR_TITLE_ELEMENT: "<h3>Connect Four</h3>", 
}

export const PLAYERS = {
  INITIAL_MESSAGE: 'Start game or select player',
  PLAYER_X: 'X',
  PLAYER_O: 'O',
  PLAYER_DRAW: 'draw',
};

export const INTERACTIONS = {
  TOTAL_SQUARES: 9,
  AI_THINKING_TIME_MS: 500,
  GAME_RESET_TIME_MS: 100,
  SQUARES_GENERAL_ID: '[id|="square"]',
  SQUARES_ID_INITIAL: 'square-',
  PLAYER_TURN: 'Turn',
  PLAYER_WIN: 'wins!',
  PLAYER_DRAW: 'Game is a draw!',
};

export const WIN_LINE_DIRECTIONS = {
  ROW: "ROW",
  COLUMN: "COLUMN",
  DIAGONAL_MAIN: "DIAGONAL_MAIN",
  DIAGONAL_SECONDARY: "DIAGONAL_SECONDARY",
};
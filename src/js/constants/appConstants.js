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
  GAME_BOARD_TTT: 'gameBoard-TTT',
  GAME_BOARD_CF: 'gameBoard-CF',
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
  CONNECT_FOUR_PLAYER_X_ID: 'White',
  CONNECT_FOUR_PLAYER_O_ID: 'Blue',
  CONNECT_FOUR_PLAYER_X: '<div class="player-x"></div>',
  CONNECT_FOUR_PLAYER_O: '<div class="player-o"></div>',
};

export const INTERACTIONS = {
  TOTAL_SQUARES: 9,
  AI_THINKING_TIME_MS: 500,
  GAME_RESET_TIME_MS: 100,
  GAME_CHANGE_TIME_MS: 1000,
  CIRCLE_DROP_TIME_MS: 65,
  SQUARES_GENERAL_ID: '[id|="square"]',
  SQUARES_ID_INITIAL: 'square-',
  CF_SQUARES_ID_INITIAL: 'square-CF-',
  PLAYER_TURN: 'Turn',
  PLAYER_WIN: 'wins!',
  PLAYER_DRAW: 'Game is a draw!',
  MINIMAX_DEPTH: 5,
};

export const WIN_LINE_DIRECTIONS = {
  ROW: "ROW",
  COLUMN: "COLUMN",
  DIAGONAL_MAIN: "DIAGONAL_MAIN",
  DIAGONAL_SECONDARY: "DIAGONAL_SECONDARY",
};
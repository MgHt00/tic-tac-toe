export const CSS_CLASS_NAMES = {
  INVISIBLE : "invisible",
  HIDDEN: "visually-hidden",
  HIGHLIGHT : "highlight",

  // IMPORTANT: The keys for winning line classes (e.g., X_WIN_ROW, O_WIN_COLUMN)
  // follow a specific pattern: `${PLAYER_SYMBOL}_WIN_${DIRECTION}`.

  // This pattern is used in `interactionManager.js` to dynamically construct these keys
  // using `PLAYERS` constants (X, O) and `WIN_LINE_DIRECTIONS` from `appConstants.js`.
  
  // If you change this naming convention here, you MUST update the logic
  // in `interactionManager.js` that generates these keys.
  X_WIN_ROW: "x-winning-square-row", 
  X_WIN_COLUMN: "x-winning-square-column", 
  X_WIN_DIAGONAL_MAIN: "x-winning-square-diagonal-main", // Top-left to bottom-right (e.g., \)
  X_WIN_DIAGONAL_SECONDARY: "x-winning-square-diagonal-secondary", // Top-right to bottom-left (e.g., /)
  O_WIN_ROW: "o-winning-square-row", 
  O_WIN_COLUMN: "o-winning-square-column", 
  O_WIN_DIAGONAL_MAIN: "o-winning-square-diagonal-main",
  O_WIN_DIAGONAL_SECONDARY: "o-winning-square-diagonal-secondary", 

  BOARD_DISABLED: "board-disabled",

  OUTLINED_BUTTON: "btn-outline-primary",
  FILLED_BUTTON: "btn-primary",

  PLAYER_X_COLOR: "player-x",
  PLAYER_O_COLOR: "player-o",
}
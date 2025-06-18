import { selectors } from "../services/selectors.js";

import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { GAME, PLAYERS, INTERACTIONS, STATE_KEYS, WIN_LINE_DIRECTIONS } from "../constants/appConstants.js";
import { globals } from "../services/globals.js";

const { PLAYER_X, PLAYER_O } = PLAYERS;

function _showOverlay() {
  selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
}

function _hideOverlay() {
  selectors.overlay.classList.add(CSS_CLASS_NAMES.INVISIBLE);
}

export function _showLoadingSpinner() {
  selectors.loadingWrapper.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
}

export function _hideLoadingSpinner() {
  selectors.loadingWrapper.classList.add(CSS_CLASS_NAMES.INVISIBLE);
}

export function addHighlight(targetElement) {
  targetElement.classList.add(CSS_CLASS_NAMES.HIGHLIGHT);
}

export function removeHighlight(targetElements) {
  targetElements = Array.isArray(targetElements) ? targetElements : [targetElements];
  targetElements.forEach(element => {
    element.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
  });
}

export function showRecentMove(targetElement) {
  console.log("move");
  addHighlight(targetElement);
  setTimeout(() => {
      removeHighlight(targetElement);
    }, INTERACTIONS.AI_THINKING_TIME_MS);
}

export function makeRestartButtonFilled() {
  selectors.restartButton.classList.remove(CSS_CLASS_NAMES.OUTLINED_BUTTON);
  selectors.restartButton.classList.add(CSS_CLASS_NAMES.FILLED_BUTTON);
}

export function makeRestartButtonOutlined() {
  selectors.restartButton.classList.remove(CSS_CLASS_NAMES.FILLED_BUTTON);
  selectors.restartButton.classList.add(CSS_CLASS_NAMES.OUTLINED_BUTTON);
}

export function removeWinningLineStyles(squareElement) {
  squareElement.classList.remove(
    CSS_CLASS_NAMES.X_WIN_ROW,
    CSS_CLASS_NAMES.X_WIN_COLUMN,
    CSS_CLASS_NAMES.X_WIN_DIAGONAL_MAIN,
    CSS_CLASS_NAMES.X_WIN_DIAGONAL_SECONDARY,
    CSS_CLASS_NAMES.O_WIN_ROW,
    CSS_CLASS_NAMES.O_WIN_COLUMN,
    CSS_CLASS_NAMES.O_WIN_DIAGONAL_MAIN,
    CSS_CLASS_NAMES.O_WIN_DIAGONAL_SECONDARY
  );
}

export function removePlayerMarkStyles(squareElement) {
  squareElement.classList.remove(
    CSS_CLASS_NAMES.PLAYER_X_COLOR, 
    CSS_CLASS_NAMES.PLAYER_O_COLOR  
  );
}

export function blackoutScreen() {
  _showOverlay();
  _showLoadingSpinner();
}

export function unBlackoutScreen() {
  _hideOverlay();
  _hideLoadingSpinner();
}

export function showConfirmationAlert() {
  selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
  selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.confirmationAlert.classList.remove(CSS_CLASS_NAMES.INVISIBLE); 
}

export function hideConfirmationAlert() {
  selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.confirmationAlert.classList.add(CSS_CLASS_NAMES.INVISIBLE); 
}

export function displayCurrentPlayer(currentPlayer) {
  if (globals.appState[STATE_KEYS.GAME_IN_PROGRESS]) { // shows default message if the game is new
      selectors.gameInfo.textContent = `${currentPlayer} ${INTERACTIONS.PLAYER_TURN}`;
  }
}

export function highlightCurrentPlayer(currentPlayer) {
  const currentPlayerButton = currentPlayer === PLAYER_X ? selectors.playerXButton : selectors.playerOButton;
  const otherPlayerButton = currentPlayer === PLAYER_X ? selectors.playerOButton : selectors.playerXButton;

  removeHighlight(otherPlayerButton);
  addHighlight(currentPlayerButton);
}

export function updateScoreOnScreen(playerXScore, playerOScore) {
  selectors.playerXScore.textContent = playerXScore;
  selectors.playerOScore.textContent = playerOScore;
}

export function showWinnerOnScreen(winningPlayer) {
  selectors.gameInfo.textContent = `${winningPlayer} ${INTERACTIONS.PLAYER_WIN}`;
}

export function changeGameTitle(game) {
  if (game !== GAME.TIC_TAC_TOE && game !== GAME.CONNECT_FOUR) {
    console.error("Invalid game:", game);
    return;
  }

  const htmlElement = game === GAME.TIC_TAC_TOE ? GAME.TIC_TAC_TOE_TITLE_ELEMENT : GAME.CONNECT_FOUR_TITLE_ELEMENT;
  selectors.gameTitle.innerHTML = htmlElement;
}

export function checkGameRadioInput(game) {
  if (game !== GAME.TIC_TAC_TOE && game !== GAME.CONNECT_FOUR) {
    console.error("Invalid game:", game);
    return;
  }
  if (game === GAME.TIC_TAC_TOE) {
    selectors.radioTTT.checked = true;
    selectors.radioTTT.focus();

  } else if (game === GAME.CONNECT_FOUR) {
    selectors.radioCF.checked = true; 
    selectors.radioCF.focus();
  } 
}

// Sets the display names for the player X and player O buttons.
export function namePlayers(currentGame) {
  if (currentGame === GAME.TIC_TAC_TOE) {
    selectors.playerXButton.textContent = PLAYERS.PLAYER_X;
    selectors.playerOButton.textContent = PLAYERS.PLAYER_O;
  } else if (currentGame === GAME.CONNECT_FOUR) {
    selectors.playerXButton.innerHTML = PLAYERS.CONNECT_FOUR_PLAYER_X;
    selectors.playerOButton.innerHTML = PLAYERS.CONNECT_FOUR_PLAYER_O;
  } else {
    console.error("Invalid game:", currentGame);
  }
}

export function convertPlayerBoxToCircle() {
  selectors.playerXButton.classList.add(CSS_CLASS_NAMES.CONVERT_TO_CIRCLE);
  selectors.playerOButton.classList.add(CSS_CLASS_NAMES.CONVERT_TO_CIRCLE);
}

export function convertPlayerBoxToSquare() {
  selectors.playerXButton.classList.remove(CSS_CLASS_NAMES.CONVERT_TO_CIRCLE);
  selectors.playerOButton.classList.remove(CSS_CLASS_NAMES.CONVERT_TO_CIRCLE);
}

export function showConnectFourBoar() {
  selectors.CFBoard.classList.remove(CSS_CLASS_NAMES.VISUALLY_HIDDEN);
  selectors.CFBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
}

export function hideConnectFourBoard() {
  selectors.CFBoard.classList.add(CSS_CLASS_NAMES.VISUALLY_HIDDEN);
  selectors.CFBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
}

export function showTTTBoard() {
  selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.VISUALLY_HIDDEN);
  selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
}

export function hideTTTBoard() {
  selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.VISUALLY_HIDDEN);
  selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
}

export function clearAllSquares() {
  const squaresNodeList = document.querySelectorAll(INTERACTIONS.SQUARES_GENERAL_ID);
  squaresNodeList.forEach(square => {
    square.textContent = "";
    removeWinningLineStyles(square);
    removePlayerMarkStyles(square);
  });
}

export function changeGameInfoContent(content) {
  selectors.gameInfo.textContent = content;
}

// Fills a square with the player's mark and applies appropriate styling.
export function fillAndDecorateSquare(targetElement, player) {
  targetElement.textContent = player;
  const cssClass = player === PLAYER_X ? CSS_CLASS_NAMES.PLAYER_X_COLOR : CSS_CLASS_NAMES.PLAYER_O_COLOR;
  targetElement.classList.add(cssClass);
}

/**
 * Applies styling to indicate the winning line on the board.
 * @param {object} winningCombinationDetails - Details of the winning combination, including key and indices.
 * @param {string} winningPlayer - The player who won (PLAYER_X or PLAYER_O).
 */
export function strikeThroughCells(winningCombinationDetails, winningPlayer, currentGame) {
  if (!winningCombinationDetails || !winningCombinationDetails.key || !winningCombinationDetails.indices) {
    console.error("Invalid winningCombinationDetails for strikeThroughCells:", winningCombinationDetails);
    return;
  }

  const { key, indices } = winningCombinationDetails;
  let baseWinType; // Will be "ROW", "COLUMN", "DIAGONAL_MAIN", or "DIAGONAL_SECONDARY"

  if (currentGame === GAME.CONNECT_FOUR) {
    console.info(key);
  }

  if (key.startsWith("row")) {
    baseWinType = WIN_LINE_DIRECTIONS.ROW;
  } else if (key.startsWith("col")) {
    baseWinType = WIN_LINE_DIRECTIONS.COLUMN;
  } else if (key === "diag1") {
    baseWinType = WIN_LINE_DIRECTIONS.DIAGONAL_MAIN;
  } else if (key === "diag2") {
    baseWinType = WIN_LINE_DIRECTIONS.DIAGONAL_SECONDARY;
  } else {
    console.error("Unknown winning combination key:", key);
    return;
  }

  // Construct the key for CSS_CLASS_NAMES, e.g., "X_WIN_ROW" or "O_WIN_DIAGONAL_MAIN"
  const cssClassKey = `${winningPlayer}_WIN_${baseWinType}`;
  const cssClass = CSS_CLASS_NAMES[cssClassKey];

  if (!cssClass) {
    console.error(`CSS class not found for key: ${cssClassKey}. Ensure PLAYERS constants ('${PLAYER_X}', '${PLAYER_O}') align with CSS_CLASS_NAMES prefixes.`);
    return;
  }

  indices.forEach(index => {
    const domRow = Math.floor(index / 3); // Result is 0, 1, or 2
    const domCol = (index % 3);      // Result is 0, 1, or 2
    const cellId = `${INTERACTIONS.SQUARES_ID_INITIAL}${domRow}-${domCol}`;
    const cellElement = document.getElementById(cellId);

    if (cellElement) {
      cellElement.classList.add(cssClass);
    } else {
      console.error(`Cell element not found for ID: ${cellId}`);
    }
  });
}

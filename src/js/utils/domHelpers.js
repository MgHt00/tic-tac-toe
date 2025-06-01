import { globals } from "../services/globals.js";
import { selectors } from "../services/selectors.js";

import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { STATE_KEYS, PLAYERS, INTERACTIONS } from "../constants/appConstants.js";

const { PLAYER_X, PLAYER_O } = PLAYERS;

function _showOverlay() {
  selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
}

function _hideOverlay() {
  selectors.overlay.classList.add(CSS_CLASS_NAMES.INVISIBLE);
}

export function _showLoadingSpinner() {
  //selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
  selectors.loadingWrapper.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
}

export function _hideLoadingSpinner() {
  //selectors.overlay.classList.add(CSS_CLASS_NAMES.INVISIBLE);
  selectors.loadingWrapper.classList.add(CSS_CLASS_NAMES.INVISIBLE);
}

export function addHighlight(targetElement) {
  targetElement.classList.add(CSS_CLASS_NAMES.HIGHLIGHT);
}

export function removeHighlight(targetElement) {
  targetElement.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
}

export function showRecentMove(targetElement) {
  console.log("move");
  addHighlight(targetElement);
  setTimeout(() => {
      removeHighlight(targetElement);
    }, 1000);
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

// Renamed from showOpponentChangeAlert
export function showConfirmationAlert() {
  selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
  selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.confirmationAlert.classList.remove(CSS_CLASS_NAMES.INVISIBLE); // Changed selector
}

// Renamed from hideOpponentChangeAlert
export function hideConfirmationAlert() {
  //selectors.overlay.classList.add(CSS_CLASS_NAMES.INVISIBLE);
  selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.confirmationAlert.classList.add(CSS_CLASS_NAMES.INVISIBLE); // Changed selector
}

export function displayCurrentPlayer() {
  selectors.gameInfo.textContent = `${globals.appState[STATE_KEYS.CURRENT_PLAYER]} ${INTERACTIONS.PLAYER_TURN}`;
}

export function highlightCurrentPlayer() {
  const currentPlayerButton = globals.appState[STATE_KEYS.CURRENT_PLAYER] === PLAYER_X ? selectors.playerXButton : selectors.playerOButton;
  const otherPlayerButton = globals.appState[STATE_KEYS.CURRENT_PLAYER] === PLAYER_X ? selectors.playerOButton : selectors.playerXButton;

  removeHighlight(otherPlayerButton);
  addHighlight(currentPlayerButton);
}


export function updateScoreOnScreen() {
  selectors.playerXScore.textContent = globals.appState[STATE_KEYS.PLAYER_X_SCORE];
  selectors.playerOScore.textContent = globals.appState[STATE_KEYS.PLAYER_O_SCORE];
}

export function showWinnerOnScreen(winningPlayer) {
  selectors.gameInfo.textContent = `${winningPlayer} ${INTERACTIONS.PLAYER_WIN}`;
}

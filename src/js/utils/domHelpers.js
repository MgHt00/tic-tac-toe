import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { selectors } from "../services/selectors.js";

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

export function showOpponentChangeAlert() {
  selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
  selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.opponentAlert.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
}

export function hideOpponentChangeAlert() {
  selectors.overlay.classList.add(CSS_CLASS_NAMES.INVISIBLE);
  selectors.TTTBoard.classList.remove(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.opponentAlert.classList.add(CSS_CLASS_NAMES.INVISIBLE);
}
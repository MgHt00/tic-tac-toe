import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";
import { selectors } from "../services/selectors.js";

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
    CSS_CLASS_NAMES.WIN_ROW,
    CSS_CLASS_NAMES.WIN_COLUMN,
    CSS_CLASS_NAMES.WIN_DIAGONAL_MAIN,
    CSS_CLASS_NAMES.WIN_DIAGONAL_SECONDARY
  );
}

export function showOpponentChangeAlert() {
  selectors.overlay.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
  selectors.TTTBoard.classList.add(CSS_CLASS_NAMES.BOARD_DISABLED);
  selectors.opponentAlert.classList.remove(CSS_CLASS_NAMES.INVISIBLE);
}

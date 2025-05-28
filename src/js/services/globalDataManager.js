import { globals } from "./globals.js";

export function restoreDefaults() {
  // Iterate over the keys in globals.defaults to correctly reset globals.appState
  // This ensures that mutable objects like arrays are properly re-initialized
  // and globals.defaults itself is not mutated.
  for (const key in globals.defaults) {
    if (Object.prototype.hasOwnProperty.call(globals.defaults, key)) { // [le002]
      const defaultValue = globals.defaults[key];
      if (Array.isArray(defaultValue)) {
        // Check if it's an array of arrays (e.g., a 2D array like `gameBoard`)
        // by seeing if its first element is also an array.
        if (defaultValue.length > 0 && Array.isArray(defaultValue[0])) { // [le003]
          // Perform a deep copy for 2D arrays
          globals.appState[key] = defaultValue.map(row => [...row]);
        } else {
          // For 1D arrays (like filledSquares or empty arrays), a shallow copy is sufficient
          globals.appState[key] = [...defaultValue];
        }
      } else {
        // Assign primitive values or shallow copy simple objects (if any)
        globals.appState[key] = defaultValue;
      }
    }
  }
}

export function updateGameBoardState(targetElement, player) {
  // data-row and data-col are 0-indexed strings, parse them to integers.
  const row = parseInt(targetElement.dataset.row, 10);
  const col = parseInt(targetElement.dataset.col, 10);

  globals.appState.gameBoard[row][col] = player;
}
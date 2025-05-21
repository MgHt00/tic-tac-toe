export function globalDataManager(globals) {
  function restoreDefaults() {
    Object.assign(globals.appState, globals.defaults);
  }

  function pushToFilledSquare(squareID) {
    globals.appState.filledSquares.push(squareID);
  }

  return {
    restoreDefaults,
  }
}
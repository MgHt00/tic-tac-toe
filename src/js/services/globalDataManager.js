export function globalDataManager(globals) {
  function restoreDefaults() {
    // Iterate over the keys in globals.defaults to correctly reset globals.appState
    // This ensures that mutable objects like arrays are properly re-initialized
    // and globals.defaults itself is not mutated.
    for (const key in globals.defaults) {
      if (Object.prototype.hasOwnProperty.call(globals.defaults, key)) { // [le002]
        const defaultValue = globals.defaults[key];
        if (Array.isArray(defaultValue)) {
          // For gameBoard, we need a deep copy to prevent mutating defaults
          if (key === 'gameBoard') {
            globals.appState[key] = defaultValue.map(row => [...row]);
          } else {
            // For other arrays (like filledSquares), a shallow copy is sufficient
            globals.appState[key] = [...defaultValue];
          }
        } else {
          // Assign primitive values or shallow copy simple objects (if any)
          globals.appState[key] = defaultValue;
        }
      }
    }
  }

  return {
    restoreDefaults,
  }
}
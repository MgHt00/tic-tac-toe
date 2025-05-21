export function globalDataManager(globals) {
  function restoreDefaults() {
    Object.assign(globals.appState, globals.defaults);
  }

  return {
    restoreDefaults,
  }
}
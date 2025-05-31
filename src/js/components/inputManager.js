import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { AI_LEVELS, PLAYERS, STATE_KEYS } from "../constants/appConstants.js";
import { showOpponentChangeAlert, hideOpponentChangeAlert, unBlackoutScreen } from "../utils/domHelpers.js";

export function inputManager(resetGameBoard) {
  // Stores the AI level that is currently confirmed and active.
  // Used to detect if a change actually occurred and to revert if cancelled.
  let _confirmedOpponentLevel = null;

  // To store references to the event handlers for easy removal.
  let _boundAlertOKHandler = null;
  let _boundAlertCancelHandler = null;

  function _setOpponentRange() {
    const minRange = 0;
    const maxRange = Object.keys(AI_LEVELS).length - 1;
    
    selectors.AILevelInput.setAttribute('min', minRange.toString());
    selectors.AILevelInput.setAttribute('max', maxRange.toString());
  }

  // Updates the label based on the current slider value.
  function _updateOpponentLabelFromSlider() {
    selectors.AILevelLabel.innerHTML = AI_LEVELS[selectors.AILevelInput.value];
  }

  // Initializes the opponent level settings from globals.
  function _initializeOpponentSettings() {
    const initialLevel = globals.appState[STATE_KEYS.OPPONENT_LEVEL];
    selectors.AILevelInput.value = initialLevel.toString();
    _confirmedOpponentLevel = initialLevel;
    _updateOpponentLabelFromSlider();
  }

  // Removes listeners from the alert buttons.
  function _removeOpponentChangeAlertListeners() {
    if (_boundAlertOKHandler) {
      selectors.opponentAlertOK.removeEventListener('click', _boundAlertOKHandler);
      _boundAlertOKHandler = null;
    }
    if (_boundAlertCancelHandler) {
      selectors.opponentAlertCancel.removeEventListener('click', _boundAlertCancelHandler);
      _boundAlertCancelHandler = null;
    }
  }

  // Adds listeners to the alert buttons.
  // newLevelAttempted: The AI level the user tried to select (from slider).
  // levelToRevertTo: The AI level to go back to if cancelled (_confirmedOpponentLevel).
  function _addOpponentChangeAlertListeners(newLevelAttempted, levelToRevertTo) {
    _removeOpponentChangeAlertListeners(); // Ensure no duplicate listeners

    _boundAlertOKHandler = () => {
      globals.appState[STATE_KEYS.OPPONENT_LEVEL] = newLevelAttempted;
      _confirmedOpponentLevel = newLevelAttempted; // Confirm the new level
      resetGameBoard();
      console.info("%cNew opponent Level: ", "color: yellow;", _confirmedOpponentLevel);
      hideOpponentChangeAlert();
      _removeOpponentChangeAlertListeners(); // Clean up after action
    };

    _boundAlertCancelHandler = () => {
      selectors.AILevelInput.value = levelToRevertTo.toString();
      _updateOpponentLabelFromSlider(); // Update label to match reverted slider
      unBlackoutScreen();
      hideOpponentChangeAlert();
      _removeOpponentChangeAlertListeners(); // Clean up after action
    };

    selectors.opponentAlertOK.addEventListener('click', _boundAlertOKHandler);
    selectors.opponentAlertCancel.addEventListener('click', _boundAlertCancelHandler);
  }

  // Handles the 'input' event on the AI level slider (fires continuously while dragging).
  function _handleSliderInput() {
    _updateOpponentLabelFromSlider(); // Update label live
  }

  function _isGameInProgress() {
    //console.info("Game in progress:", globals.appState[STATE_KEYS.GAME_IN_PROGRESS]);
    return globals.appState[STATE_KEYS.GAME_IN_PROGRESS];
  }

  // Handles the 'change' event on the AI level slider (fires when user releases mouse).
  function _handleSliderChangeFinalized() {
    const newSelectedLevel = parseInt(selectors.AILevelInput.value, 10);

    if (!_isGameInProgress()) {
      // Game is not in progress. If the level actually changed,
      // update the opponent level in appState and the confirmed level.
      if (newSelectedLevel !== _confirmedOpponentLevel) {
        globals.appState[STATE_KEYS.OPPONENT_LEVEL] = newSelectedLevel;
        _confirmedOpponentLevel = newSelectedLevel;
        console.info("%cNew opponent Level: ", "color: yellow;", _confirmedOpponentLevel);
        // No game reset is needed as the game is not currently running.
      }
      return;
    }

    // Game is in progress. If the level changed, show the alert.
    if (newSelectedLevel !== _confirmedOpponentLevel) { 
      showOpponentChangeAlert();
      _addOpponentChangeAlertListeners(newSelectedLevel, _confirmedOpponentLevel);
    }
  }

  function _namePlayers() {
    selectors.playerXButton.textContent = PLAYERS.PLAYER_X;
    selectors.playerOButton.textContent = PLAYERS.PLAYER_O;
  }
  
  // Adds listeners for the AI level range slider.
  function _addRangeListeners() {
    selectors.AILevelInput.addEventListener('input', _handleSliderInput);
    selectors.AILevelInput.addEventListener('change', _handleSliderChangeFinalized);
  }

  function _addRestartButtonListener() {
    selectors.restartButton.addEventListener("click", () => {
      resetGameBoard();
    });
  }

  function initializeInput() {
    _setOpponentRange();
    _initializeOpponentSettings();
    _namePlayers();
    _addRangeListeners();
    _addRestartButtonListener();
  }

  return {
    initializeInput,
  }
}
import { selectors } from "../services/selectors.js";
import { globals } from "../services/globals.js";
import { AI_LEVELS, PLAYERS, STATE_KEYS } from "../constants/appConstants.js";
import { showConfirmationAlert, hideConfirmationAlert, unBlackoutScreen, updateScoreOnScreen } from "../utils/domHelpers.js";

export function inputManager(resetGameBoard) {
  // Stores the AI level that is currently confirmed and active.
  // Used to detect if a change actually occurred and to revert if cancelled.
  let _confirmedOpponentLevel = null;

  // To store references to the event handlers for easy removal.
  let _boundAlertOKHandler = null;
  let _boundAlertCancelHandler = null;

  // Sets the min and max attributes for the AI difficulty range input based on available AI_LEVELS.
  function _setOpponentRange() {
    const minRange = 0;
    const maxRange = Object.keys(AI_LEVELS).length - 1;
    
    selectors.AILevelInput.setAttribute('min', minRange.toString());
    selectors.AILevelInput.setAttribute('max', maxRange.toString());
  }

  // Sets the display names for the player X and player O buttons.
  function _namePlayers() {
    selectors.playerXButton.textContent = PLAYERS.PLAYER_X;
    selectors.playerOButton.textContent = PLAYERS.PLAYER_O;
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

  // Removes listeners from the confirmation alert buttons.
  function _removeConfirmationAlertListeners() {
    if (_boundAlertOKHandler) {
      selectors.confirmationAlertOK.removeEventListener('click', _boundAlertOKHandler); // Changed selector
      _boundAlertOKHandler = null;
    }
    if (_boundAlertCancelHandler) {
      selectors.confirmationAlertCancel.removeEventListener('click', _boundAlertCancelHandler); // Changed selector
      _boundAlertCancelHandler = null;
    }
  }

  // Adds listeners to the confirmation alert buttons (specifically for opponent change scenario).
  // newLevelAttempted: The AI level the user tried to select (from slider).
  // levelToRevertTo: The AI level to go back to if cancelled (_confirmedOpponentLevel).
  function _addConfirmationAlertListeners(newLevelAttempted, levelToRevertTo) {
    _removeConfirmationAlertListeners(); // Ensure no duplicate listeners

    _boundAlertOKHandler = () => {
      globals.appState[STATE_KEYS.OPPONENT_LEVEL] = newLevelAttempted;
      _confirmedOpponentLevel = newLevelAttempted; // Confirm the new level
      resetGameBoard({ resetScore: true });
      updateScoreOnScreen();
      hideConfirmationAlert(); // Use new function name
      _removeConfirmationAlertListeners(); // Clean up after action
      console.info("%cNew opponent Level: ", "color: yellow;", _confirmedOpponentLevel);
    };

    _boundAlertCancelHandler = () => {
      selectors.AILevelInput.value = levelToRevertTo.toString();
      _updateOpponentLabelFromSlider(); // Update label to match reverted slider
      unBlackoutScreen();
      hideConfirmationAlert(); // Use new function name
      _removeConfirmationAlertListeners(); // Clean up after action
    };

    selectors.confirmationAlertOK.addEventListener('click', _boundAlertOKHandler); // Changed selector
    selectors.confirmationAlertCancel.addEventListener('click', _boundAlertCancelHandler); // Changed selector
  }

  // Determines if a game is considered "in progress" for the purpose of showing
  // an alert when changing the AI opponent. This is true if the current board
  // is active OR if there are any accumulated scores from previous games.
  function _isGameInProgress() {
    const gameInProgress = globals.appState[STATE_KEYS.GAME_IN_PROGRESS];
    const isScoreZero = globals.appState[STATE_KEYS.PLAYER_X_SCORE] === 0 && globals.appState[STATE_KEYS.PLAYER_O_SCORE] === 0;
    return gameInProgress || !isScoreZero;
  }

  // Handles the 'change' event on the AI level slider (fires when user releases mouse).
  function _handleSliderChange() {
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
      showConfirmationAlert(); // Use new function name
      _addConfirmationAlertListeners(newSelectedLevel, _confirmedOpponentLevel);
    }
  }

  // Handles the 'input' event on the AI level slider (fires continuously while dragging).
  function _handleSliderInput() {
    _updateOpponentLabelFromSlider(); // Update label live
  }

  // Adds listeners for the AI level range slider.
  function _addRangeListeners() {
    selectors.AILevelInput.addEventListener('input', _handleSliderInput);
    selectors.AILevelInput.addEventListener('change', _handleSliderChange);
  }

  function _addRestartButtonListener() {
    selectors.restartButton.addEventListener("click", () => {
      resetGameBoard({ resetScore: false });
    });
  }

  function _setStartingPlayer(selectedPlayerSymbol) {
    console.info("_setStartingPlayer: ", selectedPlayerSymbol);
    globals.appState[STATE_KEYS.STARTING_PLAYER] = selectedPlayerSymbol;
  }

  function _handlePlayerChange(playerSymbolToSet) {
    console.warn("ARE YOU SURE?");
    
    const currentStartingPlayer = globals.appState[STATE_KEYS.STARTING_PLAYER];
    const newStartingPlayer = playerSymbolToSet === PLAYERS.PLAYER_X ? PLAYERS.PLAYER_X : PLAYERS.PLAYER_O;
    
    if (currentStartingPlayer !== newStartingPlayer) {
      
      //globals.appState[STATE_KEYS.STARTING_PLAYER] = newStartingPlayer;
    }

  }

  function _addPlayerButtonListeners() {
    const scoreBoard = selectors.scoreBoard;
    const playerXBtn = selectors.playerXButton;
    const playerOBtn = selectors.playerOButton;

    scoreBoard.addEventListener("click", (event) => {
      const clickedElement = event.target;
      let playerSymbolToSet = null;

      if (clickedElement === playerXBtn) {
        playerSymbolToSet = PLAYERS.PLAYER_X;
      } else if (clickedElement === playerOBtn) {
        playerSymbolToSet = PLAYERS.PLAYER_O;
      }

      if (playerSymbolToSet && !_isGameInProgress())  {
        _setStartingPlayer(playerSymbolToSet);
        return;
        //_setStartingPlayer(playerSymbolToSet);
        //resetGameBoard({ resetScore: false });
      }

      _handlePlayerChange(playerSymbolToSet);
    });
  }

  function initializeInput() {
    _setOpponentRange();
    _initializeOpponentSettings();
    _namePlayers();
    _addRangeListeners();
    _addPlayerButtonListeners();
    _addRestartButtonListener();
  }

  return {
    initializeInput,
  }
}
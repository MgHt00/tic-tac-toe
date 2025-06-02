import { selectors } from "../services/selectors.js";
import {
  getStartingPlayer,
  setStartingPlayer,
  getOpponentLevel,
  setOpponentLevel,
  isGameInProgressState,
  getPlayerXScore,
  getPlayerOScore,
} from "../services/globalDataManager.js";
import { AI_LEVELS, PLAYERS } from "../constants/appConstants.js";
import { showConfirmationAlert, hideConfirmationAlert, unBlackoutScreen, updateScoreOnScreen } from "../utils/domHelpers.js";

export function inputManager(resetGameBoard, initializeGameInteraction) {
  // Stores the AI level that is currently confirmed and active.
  // Used to detect if a change actually occurred and to revert if cancelled.
  let _confirmedOpponentLevel = null;
  let _confirmedStartingPlayer = null;

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
    const initialLevel = getOpponentLevel();
    selectors.AILevelInput.value = initialLevel.toString();
    _confirmedOpponentLevel = initialLevel;
    _updateOpponentLabelFromSlider();
  }

  function _initializeStartingPlayer() {
    _confirmedStartingPlayer = getStartingPlayer();
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

  // Adds listeners to the confirmation alert buttons specifically for an opponent change.
  // newLevelAttempted: The AI level the user tried to select (from slider).
  // levelToRevertTo: The AI level to go back to if cancelled (_confirmedOpponentLevel).
  function _addOpponentChangeConfirmationListeners(newLevelAttempted, levelToRevertTo) {
    _removeConfirmationAlertListeners(); // Ensure no duplicate listeners

    _boundAlertOKHandler = () => {
      setOpponentLevel(newLevelAttempted);
      _confirmedOpponentLevel = newLevelAttempted; // Confirm the new level
      resetGameBoard({ resetScore: true, resetStartingPlayer: false });
      updateScoreOnScreen(getPlayerXScore(), getPlayerOScore());
      hideConfirmationAlert(); 
      _removeConfirmationAlertListeners(); // Clean up after action
      console.info("%cNew opponent Level: ", "color: yellow;", _confirmedOpponentLevel);
    };

    _boundAlertCancelHandler = () => {
      selectors.AILevelInput.value = levelToRevertTo.toString();
      _updateOpponentLabelFromSlider(); // Update label to match reverted slider
      unBlackoutScreen();
      hideConfirmationAlert(); 
      _removeConfirmationAlertListeners(); // Clean up after action
    };

    selectors.confirmationAlertOK.addEventListener('click', _boundAlertOKHandler); 
    selectors.confirmationAlertCancel.addEventListener('click', _boundAlertCancelHandler); 
  }

  function _addStartingPlayerChangeConfirmationListeners(newStartingPlayer, startingPlayerToRevertTo) {
    _removeConfirmationAlertListeners(); // Ensure no duplicate listeners

    _boundAlertOKHandler = () => {
      setStartingPlayer(newStartingPlayer);
      _confirmedStartingPlayer = newStartingPlayer; // Confirm the new starting player
      resetGameBoard({ resetScore: true, resetStartingPlayer: false });
      updateScoreOnScreen(getPlayerXScore(), getPlayerOScore());
      hideConfirmationAlert(); 
      _removeConfirmationAlertListeners(); // Clean up after action
      initializeGameInteraction();
      console.info("%cNew starting player: ", "color: yellow;", _confirmedStartingPlayer);
    }

    _boundAlertCancelHandler = () => {
      //selectors.playerXButton.textContent = startingPlayerToRevertTo === PLAYERS.PLAYER_X ? PLAYERS.PLAYER_X : PLAYERS.PLAYER_O;
      // No need to set appState here, just revert the _confirmedStartingPlayer for internal logic if needed, or rely on UI to not change.
      setStartingPlayer(startingPlayerToRevertTo);
      _confirmedStartingPlayer = startingPlayerToRevertTo; // Confirm the new starting player
      unBlackoutScreen();
      hideConfirmationAlert();
    };

    selectors.confirmationAlertOK.addEventListener('click', _boundAlertOKHandler); 
    selectors.confirmationAlertCancel.addEventListener('click', _boundAlertCancelHandler); 

  }

  // Determines if a game is considered "in progress" for the purpose of showing
  // an alert when changing the AI opponent. This is true if the current board
  // is active OR if there are any accumulated scores from previous games.
  function _isGameInProgress() {
    const gameInProgress = isGameInProgressState();
    const isScoreZero = getPlayerXScore() === 0 && getPlayerOScore() === 0;
    return gameInProgress || !isScoreZero;
  }

  // Handles the 'change' event on the AI level slider (fires when user releases mouse).
  function _handleSliderChange() {
    const newSelectedLevel = parseInt(selectors.AILevelInput.value, 10);

    if (!_isGameInProgress()) {
      // Game is not in progress. If the level actually changed,
      // update the opponent level in appState and the confirmed level.
      if (newSelectedLevel !== _confirmedOpponentLevel) {
        setOpponentLevel(newSelectedLevel);
        _confirmedOpponentLevel = newSelectedLevel;
        console.info("%cNew opponent Level: ", "color: yellow;", _confirmedOpponentLevel);
        // No game reset is needed as the game is not currently running.
      }
      return;
    }

    // Game is in progress. If the level changed, show the alert.
    if (newSelectedLevel !== _confirmedOpponentLevel) { 
      showConfirmationAlert(); 
      _addOpponentChangeConfirmationListeners(newSelectedLevel, _confirmedOpponentLevel);
    }
  }

  function _handlePlayerChange(playerSymbolToSet) {
    const newSelectedPlayer = playerSymbolToSet === PLAYERS.PLAYER_X ? PLAYERS.PLAYER_X : PLAYERS.PLAYER_O;

    if (!_isGameInProgress()){
      if (newSelectedPlayer !== _confirmedStartingPlayer) {
        setStartingPlayer(newSelectedPlayer);
        _confirmedStartingPlayer = newSelectedPlayer;
        console.info("%cNew starting player: ", "color: yellow;", _confirmedStartingPlayer);
        initializeGameInteraction();
      }
      return;
    }

    if (newSelectedPlayer !== _confirmedStartingPlayer) { 
      showConfirmationAlert();
      _addStartingPlayerChangeConfirmationListeners(newSelectedPlayer, _confirmedStartingPlayer)
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
      resetGameBoard({ resetScore: false, resetStartingPlayer: false });
    });
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

      if (playerSymbolToSet)  {
       _handlePlayerChange(playerSymbolToSet);
      }      
    });
  }

  function initializeInput() {
    _setOpponentRange();
    _initializeOpponentSettings();
    _initializeStartingPlayer();
    _namePlayers();
    _addRangeListeners();
    _addPlayerButtonListeners();
    _addRestartButtonListener();
  }

  return {
    initializeInput,
  }
}
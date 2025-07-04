import { ELEMENT_IDS } from "../constants/elementIDs.js";

export const selectors = {
  gameSwitchWrapper: document.querySelector(`#${ELEMENT_IDS.GAME_SWITCH_WRAPPER}`),
  gameTitle: document.querySelector(`#${ELEMENT_IDS.GAME_TITLE}`),

  AILevelLabel : document.querySelector(`#${ELEMENT_IDS.AI_LEVEL_LABEL}`),
  AILevelInput: document.querySelector(`#${ELEMENT_IDS.AI_LEVEL_INPUT}`),

  scoreBoard: document.querySelector(`#${ELEMENT_IDS.SCORE_BOARD}`),
  playerXButton: document.querySelector(`#${ELEMENT_IDS.PLAYER_X_BUTTON}`),
  playerOButton: document.querySelector(`#${ELEMENT_IDS.PLAYER_O_BUTTON}`),
  playerXScore: document.querySelector(`#${ELEMENT_IDS.PLAYER_X_SCORE}`),
  playerOScore: document.querySelector(`#${ELEMENT_IDS.PLAYER_O_SCORE}`),

  gameInfo: document.querySelector(`#${ELEMENT_IDS.GAME_INFO}`),
  gameWrapper: document.querySelector(`#${ELEMENT_IDS.GAME_WRAPPER}`),
  
  TTTBoard: document.querySelector(`#${ELEMENT_IDS.TTT_BOARD}`),
  CFBoard: document.querySelector(`#${ELEMENT_IDS.CF_BOARD}`),

  restartButton: document.querySelector(`#${ELEMENT_IDS.RESTART_BUTTON}`),
  switchTTTButton: document.querySelector(`#${ELEMENT_IDS.SWITCH_TTT_BUTTON}`),
  switchCFButton: document.querySelector(`#${ELEMENT_IDS.SWITCH_CF_BUTTON}`),
  radioTTT: document.querySelector(`#${ELEMENT_IDS.RADIO_TTT}`),
  radioCF: document.querySelector(`#${ELEMENT_IDS.RADIO_CF}`),

  overlay: document.querySelector(`#${ELEMENT_IDS.OVERLAY}`),
  loadingWrapper: document.querySelector(`#${ELEMENT_IDS.LOADING_WRAPPER}`),

  confirmationAlert: document.querySelector(`#${ELEMENT_IDS.CONFIRMATION_ALERT_WRAPPER}`),
  confirmationAlertOK: document.querySelector(`#${ELEMENT_IDS.CONFIRMATION_ALERT_OK}`),
  confirmationAlertCancel: document.querySelector(`#${ELEMENT_IDS.CONFIRMATION_ALERT_CANCEL}`),

};
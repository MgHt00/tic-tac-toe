import { ELEMENT_IDS } from "../constants/elementIDs.js";

export const selectors = {
  AILevelLabel : document.querySelector(`#${ELEMENT_IDS.AI_LEVEL_LABEL}`),
  AILevelInput: document.querySelector(`#${ELEMENT_IDS.AI_LEVEL_INPUT}`),

  playerXButton: document.querySelector(`#${ELEMENT_IDS.PLAYER_X_BUTTON}`),
  playerOButton: document.querySelector(`#${ELEMENT_IDS.PLAYER_O_BUTTON}`),
  playerXScore: document.querySelector(`#${ELEMENT_IDS.PLAYER_X_SCORE}`),
  playerOScore: document.querySelector(`#${ELEMENT_IDS.PLAYER_O_SCORE}`),

  gameInfo: document.querySelector(`#${ELEMENT_IDS.GAME_INFO}`),
  gameWrapper: document.querySelector(`#${ELEMENT_IDS.GAME_WRAPPER}`),
  
  TTTBoard: document.querySelector(`#${ELEMENT_IDS.TTT_BOARD}`),
  Square_1_1: document.querySelector(`#${ELEMENT_IDS.SQUARE_1_1}`),
  Square_1_2: document.querySelector(`#${ELEMENT_IDS.SQUARE_1_2}`),
  Square_1_3: document.querySelector(`#${ELEMENT_IDS.SQUARE_1_3}`),
  Square_2_1: document.querySelector(`#${ELEMENT_IDS.SQUARE_2_1}`),
  Square_2_2: document.querySelector(`#${ELEMENT_IDS.SQUARE_2_2}`),
  Square_2_3: document.querySelector(`#${ELEMENT_IDS.SQUARE_2_3}`),
  Square_3_1: document.querySelector(`#${ELEMENT_IDS.SQUARE_3_1}`),
  Square_3_2: document.querySelector(`#${ELEMENT_IDS.SQUARE_3_2}`),
  Square_3_3: document.querySelector(`#${ELEMENT_IDS.SQUARE_3_3}`),

  restartButton: document.querySelector(`#${ELEMENT_IDS.RESTART_BUTTON}`),
}
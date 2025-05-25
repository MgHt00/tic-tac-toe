import '../lib/bootstrap.bundle.js';

import { globalDataManager } from './services/globalDataManager.js';
import { inputManager } from './components/inputManager.js';
import { loadingManager } from './components/loadingManager.js';
import { interactionManager } from './components/interactionManager.js';
import { globals } from './services/globals.js';

const dataManager = globalDataManager(globals);
const { restoreDefaults } = dataManager;

const input = inputManager();
const { initializeInput } = input;

const load = loadingManager(initializeInput, restoreDefaults);
const { preLoad } = load;

const interaction = interactionManager(restoreDefaults);
const { initializeGameInteraction } = interaction;

(async function() {
  preLoad();
  initializeGameInteraction();
})();
import '../lib/bootstrap.bundle.js';

import { inputManager } from './components/inputManager.js';

const input = inputManager();
const { initializeInput } = input;

(function initialize() {
  initializeInput();
})();
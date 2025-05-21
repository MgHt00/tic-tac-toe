import { CSS_CLASS_NAMES } from "../constants/cssClassNames.js";

export function addHighlight(targetElement) {
    targetElement.classList.add(CSS_CLASS_NAMES.HIGHLIGHT);
}

export function removeHighlight(targetElement) {
  targetElement.classList.remove(CSS_CLASS_NAMES.HIGHLIGHT);
}
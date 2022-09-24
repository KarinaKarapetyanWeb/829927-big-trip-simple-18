export const createPointFormCloseBtnTemplate = (isDisabled) =>
  `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
    <span class="visually-hidden">Open event</span>
   </button>`;

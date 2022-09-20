import AbstractView from '../framework/view/abstract-view.js';

const renderSortOptionsTemplate = (options, currentSortType) =>
  options
    .map(
      (option) =>
        `<div class="trip-sort__item  trip-sort__item--${option.name}">
          <input id="sort-${option.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${option.name}" ${option.name === currentSortType ? 'checked' : ''} ${
  option.disabled ? 'disabled' : ''
}>
          <label class="trip-sort__btn" for="sort-${option.name}">${option.name}</label>
        </div>`
    )
    .join('');

const createSortTemplate = (options, currentSortType) =>
  `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${renderSortOptionsTemplate(options, currentSortType)}
  </form>`;

export default class SortView extends AbstractView {
  #options = null;
  #currentSortType = null;

  constructor(options, currentSortType) {
    super();
    this.#options = options;
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#options, this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.value);
  };
}

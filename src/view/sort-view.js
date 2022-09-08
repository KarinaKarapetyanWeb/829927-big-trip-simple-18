import AbstractView from '../framework/view/abstract-view.js';

const renderSortOptionsTemplate = (options) =>
  options
    .map(
      (option, index) =>
        `<div class="trip-sort__item  trip-sort__item--${option.name}">
          <input id="sort-${option.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${option.name}" ${index === 0 ? 'checked' : ''}>
          <label class="trip-sort__btn" for="sort-${option.name}">${option.name}</label>
        </div>`
    )
    .join('');

const createSortTemplate = (options) =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${renderSortOptionsTemplate(options)}
  </form>`;

export default class SortView extends AbstractView {
  #options = null;

  constructor(options) {
    super();
    this.#options = options;
  }

  get template() {
    return createSortTemplate(this.#options);
  }
}

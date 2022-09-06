import AbstractView from '../framework/view/abstract-view.js';

const renderFilters = (filters) =>
  filters
    .map(
      (filter, index) => `<div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${filter.count === 0 ? 'disabled' : ''} ${index === 0 ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
    </div>`
    )
    .join('');

const createFilterTemplate = (filters) =>
  `<form class="trip-filters" action="#" method="get">
    ${renderFilters(filters)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}

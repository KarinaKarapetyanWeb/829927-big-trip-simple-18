import { createElement } from '../render.js';
import { formatDate, humanizeDate, formatTime } from '../utils';
import { createPointOffersTemplate } from './template/point-offers-template.js';

const createPointTemplate = (point, pointDestination, pointOffers) => {
  const { basePrice, dateFrom, dateTo, type } = point;

  const { name } = pointDestination;

  return `<div class="event">
            <time class="event__date" datetime=${formatDate(dateFrom)}>${humanizeDate(dateFrom)}</time>
            <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
            </div>
            <h3 class="event__title">${name}</h3>
            <div class="event__schedule">
                <p class="event__time">
                <time class="event__start-time" datetime="${formatDate(dateFrom)}T${formatTime(dateFrom)}">${formatTime(dateFrom)}</time>
                —
                <time class="event__end-time" datetime="${formatDate(dateFrom)}T${formatTime(dateTo)}">${formatTime(dateTo)}</time>
                </p>
            </div>
            <p class="event__price">
                €&nbsp;<span class="event__price-value">${basePrice}</span>
            </p>
            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
                ${createPointOffersTemplate(pointOffers)}
            </ul>
            <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
            </button>
          </div>`;
};

export default class PointView {
  #element = null;
  #point = null;
  #destination = null;
  #offers = [];

  constructor(point, pointDestination, pointOffers) {
    this.#point = point;
    this.#destination = pointDestination;
    this.#offers = pointOffers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

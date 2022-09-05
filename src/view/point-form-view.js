import AbstractView from '../framework/view/abstract-view.js';
import { getSelectedDestination } from '../utils/point.js';
import { BLANK_POINT } from '../const.js';
import { createPointFormDestinationTemplate } from './template/point-form-destination-template.js';
import { createPointFormOffersTemplate } from './template/point-form-offers-template.js';
import { createPointFormDestinationInfoTemplate } from './template/point-form-destination-info-template.js';
import { createPointFormPriceTemplate } from './template/point-form-price-template.js';
import { createPointFormDatesTemplate } from './template/point-form-dates-template.js';
import { createPointFormTypesTemplate } from './template/point-form-types-template.js';
import { createPointFormCloseBtnTemplate } from './template/point-form-close-btn-template.js';

const createPointFormTemplate = (action, point, destinations, offers) => {
  const { basePrice, dateFrom, dateTo, type, destination, offers: selectedOffersId } = point;

  const isArrowUp = action === 'edit';

  const initialPrice = basePrice !== null ? basePrice : '';

  const initialDestination = destination !== null ? getSelectedDestination(destinations, destination) : destination;

  const isDestinationInfo = destination !== null;

  const isOffers = offers.length;

  const isOffersAndDestinationInfo = isOffers || isDestinationInfo;

  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
        ${createPointFormTypesTemplate(type)}

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
          </label>
          ${createPointFormDestinationTemplate(destinations, initialDestination)}
        </div>

        ${createPointFormDatesTemplate(dateFrom, dateTo)}

        ${createPointFormPriceTemplate(initialPrice)}

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
        ${isArrowUp ? createPointFormCloseBtnTemplate() : ''}
    </header>
    ${
  isOffersAndDestinationInfo
    ? `<section class="event__details">
        ${isOffers ? createPointFormOffersTemplate(offers, selectedOffersId) : ''}

        ${isDestinationInfo ? createPointFormDestinationInfoTemplate(initialDestination) : ''}
      </section>`
    : ''
}
  </form>`;
};

export default class PointFormView extends AbstractView {
  #action = null;
  #point = null;
  #destinations = [];
  #offers = [];

  constructor(action, point = BLANK_POINT, destinations, offers) {
    super();
    this.#action = action;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#point = point;
  }

  get template() {
    return createPointFormTemplate(this.#action, this.#point, this.#destinations, this.#offers);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  setCloseBtnClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeBtnClickHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };

  #closeBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };
}

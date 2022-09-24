import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getSelectedDestination } from '../utils/point.js';
import { BLANK_POINT, ActionType } from '../const.js';
import { createPointFormDestinationTemplate } from './template/point-form-destination-template.js';
import { createPointFormOffersTemplate } from './template/point-form-offers-template.js';
import { createPointFormDestinationInfoTemplate } from './template/point-form-destination-info-template.js';
import { createPointFormPriceTemplate } from './template/point-form-price-template.js';
import { createPointFormDatesTemplate } from './template/point-form-dates-template.js';
import { createPointFormTypesTemplate } from './template/point-form-types-template.js';
import { createPointFormCloseBtnTemplate } from './template/point-form-close-btn-template.js';
import { getDestinationId, getOffersByType } from '../utils/point.js';

const createPointFormTemplate = (action, point, destinations, offers) => {
  const { basePrice, dateFrom, dateTo, destination, type, offers: selectedOffersId, isDisabled, isSaving, isDeleting } = point;
  const isEditForm = action === ActionType.EDIT;
  const initialPrice = basePrice !== null ? basePrice : '';
  const initialDestination = destination !== null ? getSelectedDestination(destinations, destination) : null;
  const offersByType = getOffersByType(offers, point.type);
  const isDestinationInfo = destination !== null;
  const isOffers = offersByType.length !== 0;
  const isOffersOrDestinationInfo = isOffers || isDestinationInfo;
  const isSubmitDisabled = !initialPrice || !initialDestination || !dateFrom || !dateTo;

  const getDeleteBtnLabel = () => {
    let label;
    if (!isDeleting) {
      label = isEditForm ? 'Delete' : 'Cancel';
    } else {
      label = isEditForm ? 'Deleting' : 'Cancelling';
    }
    return label;
  };

  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
        ${createPointFormTypesTemplate(type, isDisabled)}

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
          </label>
          ${createPointFormDestinationTemplate(destinations, initialDestination, isDisabled)}
        </div>

        ${createPointFormDatesTemplate(dateFrom, dateTo, isDisabled)}

        ${createPointFormPriceTemplate(initialPrice, isDisabled)}

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled || isSubmitDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${getDeleteBtnLabel()}</button>
        ${isEditForm ? createPointFormCloseBtnTemplate(isDisabled) : ''}
    </header>
    ${
  isOffersOrDestinationInfo
    ? `<section class="event__details">
        ${isOffers ? createPointFormOffersTemplate(offersByType, selectedOffersId, isDisabled) : ''}

        ${isDestinationInfo ? createPointFormDestinationInfoTemplate(initialDestination) : ''}
      </section>`
    : ''
}
  </form>`;
};

export default class PointFormView extends AbstractStatefulView {
  #action = null;
  #destinations = [];
  #destinationOptions = [];
  #offers = [];
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(action, point = BLANK_POINT, destinations, offers) {
    super();
    this.#action = action;
    this.#destinations = destinations;
    this.#destinationOptions = this.#destinations.map((destination) => destination.name);
    this.#offers = offers;
    this._state = PointFormView.parsePointToState(point);
    this.#setDatepicker();
    this.#setInnerHandlers();
  }

  get template() {
    return createPointFormTemplate(this.#action, this._state, this.#destinations, this.#offers);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  reset = (point) => {
    this.updateElement(PointFormView.parsePointToState(point));
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#formSubmitHandler);
  };

  setCloseBtnClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeBtnClickHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);

    if (this.#action === ActionType.EDIT) {
      this.setCloseBtnClickHandler(this._callback.closeClick);
    }
  };

  #isValidDestination = (value) => {
    if (this.#destinationOptions.includes(value)) {
      return true;
    }
    return false;
  };

  #isValidPrice = (value) => {
    if (isNaN(value)) {
      return false;
    }

    return value > 0;
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this._callback.formSubmit(PointFormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointFormView.parseStateToPoint(this._state));
  };

  #closeBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    if (this.#isValidDestination(evt.target.value)) {
      const selectedDestinationId = getDestinationId(this.#destinations, evt.target.value);
      this.updateElement({
        destination: selectedDestinationId,
      });
    } else {
      this.updateElement({
        destination: null,
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    if (this.#isValidPrice(+evt.target.value)) {
      this.updateElement({
        basePrice: Math.ceil(+evt.target.value),
      });
    } else {
      this.updateElement({
        basePrice: null,
      });
    }
  };

  #offersClickHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    if (evt.target.checked) {
      this._setState({
        offers: [...this._state.offers, +evt.target.value],
      });
    } else {
      this._setState({
        offers: this._state.offers.filter((offerId) => offerId !== +evt.target.value),
      });
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepicker = () => {
    this.#datepickerFrom = flatpickr(this.element.querySelector('#event-start-time-1'), {
      locale: {
        firstDayOfWeek: 1,
      },
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      minDate: 'today',
      enableTime: true,
      onChange: this.#dateFromChangeHandler,
    });
    this.#datepickerTo = flatpickr(this.element.querySelector('#event-end-time-1'), {
      locale: {
        firstDayOfWeek: 1,
      },
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom,
      enableTime: true,
      onChange: this.#dateToChangeHandler,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('change', this.#priceChangeHandler);
    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersClickHandler);
    }
  };

  static parsePointToState = (point) => ({ ...point, isDisabled: false, isSaving: false, isDeleting: false });

  static parseStateToPoint = (state) => {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}

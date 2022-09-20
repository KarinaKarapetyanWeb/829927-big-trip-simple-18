import EventItemView from '../view/event-item-view.js';
import PointFormView from '../view/point-form-view.js';
import PointView from '../view/point-view.js';
import { replace, remove } from '../framework/render.js';
import { ActionType, Mode, UserAction, UpdateType } from '../const.js';
import { isEscKey } from '../utils/common.js';
import { renderEventListItem } from '../utils/event.js';
import { getSelectedDestination, getSelectedOffers, getOffersByType, isDatesEqual, isPricesEqual } from '../utils/point.js';

export default class EventPresenter {
  #changeData = null;
  #changeMode = null;

  #eventListCopmonent = null;
  #eventItemComponent = null;
  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;
  #destinationsModel = null;
  #offersModel = null;

  #mode = Mode.DEFAULT;

  constructor(eventListCopmonent, changeData, changeMode) {
    this.#eventListCopmonent = eventListCopmonent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, destinationsModel, offersModel) => {
    this.#event = point;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    const selectedDestination = getSelectedDestination([...this.#destinationsModel.destinations], this.#event.destination);
    const selectedOffers = getSelectedOffers(getOffersByType([...this.#offersModel.offers], this.#event.type), this.#event.offers);

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventItemComponent = new EventItemView();
    this.#eventComponent = new PointView(point, selectedDestination, selectedOffers);
    this.#eventEditComponent = new PointFormView(ActionType.EDIT, this.#event, [...this.#destinationsModel.destinations], [...this.#offersModel.offers]);

    this.#eventComponent.setEditBtnClickHandler(this.#handleEditClick);

    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    this.#eventEditComponent.setCloseBtnClickHandler(this.#handleCloseClick);

    this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      renderEventListItem(this.#eventListCopmonent, this.#eventItemComponent, this.#eventComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  };

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
    remove(this.#eventItemComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt) && evt.target.tagName !== 'INPUT') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    } else if (isEscKey(evt) && evt.target.tagName === 'INPUT') {
      evt.target.blur();
    }
  };

  #replacePointToForm = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    this.#eventEditComponent.reset(this.#event);
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#event.dateFrom, update.dateFrom) || !isPricesEqual(this.#event.basePrice, update.basePrice);

    this.#changeData(UserAction.UPDATE_POINT, isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, update);
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };
}

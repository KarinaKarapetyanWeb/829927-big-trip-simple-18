import { remove, RenderPosition } from '../framework/render.js';
import EventItemView from '../view/event-item-view.js';
import PointFormView from '../view/point-form-view.js';
import { ActionType, UserAction, UpdateType } from '../const.js';
import { isEscKey } from '../utils/common.js';
import { renderEventListItem } from '../utils/event.js';

export default class CreateEventPresenter {
  #eventListCopmonent = null;
  #eventItemComponent = null;
  #createEventComponent = null;

  #destinations = [];
  #offers = [];

  #changeData = null;
  #destroyCallback = null;

  constructor(eventListCopmonent, changeData) {
    this.#eventListCopmonent = eventListCopmonent;
    this.#changeData = changeData;
  }

  init = (destinationsModel, offersModel, callback) => {
    this.#destinations = [...destinationsModel.destinations];
    this.#offers = [...offersModel.offers];
    this.#destroyCallback = callback;

    if (this.#createEventComponent !== null) {
      return;
    }

    this.#eventItemComponent = new EventItemView();
    this.#createEventComponent = new PointFormView(ActionType.CREATE, undefined, this.#destinations, this.#offers);

    this.#createEventComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#createEventComponent.setDeleteClickHandler(this.#handleDeleteClick);

    renderEventListItem(this.#eventListCopmonent, this.#eventItemComponent, this.#createEventComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#createEventComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#eventItemComponent);
    remove(this.#createEventComponent);

    this.#eventItemComponent = null;
    this.#createEventComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#createEventComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#createEventComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#createEventComponent.shake(resetFormState);
  };

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt) && evt.target.tagName !== 'INPUT') {
      evt.preventDefault();
      this.destroy();
    } else if (isEscKey(evt) && evt.target.tagName === 'INPUT') {
      evt.target.blur();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(UserAction.ADD_POINT, UpdateType.MINOR, point);
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}

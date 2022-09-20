import { remove, RenderPosition } from '../framework/render.js';
import EventItemView from '../view/event-item-view.js';
import PointFormView from '../view/point-form-view.js';
import { ActionType, UserAction, UpdateType } from '../const.js';
import { isEscKey } from '../utils/common.js';
import { renderEventListItem } from '../utils/event.js';
import { nanoid } from 'nanoid';

export default class CreateEventPresenter {
  #eventListCopmonent = null;
  #eventItemComponent = null;
  #createEventComponent = null;

  #destinationsModel = null;
  #offersModel = null;

  #changeData = null;
  #destroyCallback = null;

  constructor(eventListCopmonent, changeData) {
    this.#eventListCopmonent = eventListCopmonent;
    this.#changeData = changeData;
  }

  init = (destinationsModel, offersModel, callback) => {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#destroyCallback = callback;

    if (this.#createEventComponent !== null) {
      return;
    }

    this.#eventItemComponent = new EventItemView();
    this.#createEventComponent = new PointFormView(ActionType.CREATE, undefined, [...this.#destinationsModel.destinations], [...this.#offersModel.offers]);

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

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt) && evt.target.tagName !== 'INPUT') {
      evt.preventDefault();
      this.destroy();
    } else if (isEscKey(evt) && evt.target.tagName === 'INPUT') {
      evt.target.blur();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      { id: nanoid(), ...point }
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}

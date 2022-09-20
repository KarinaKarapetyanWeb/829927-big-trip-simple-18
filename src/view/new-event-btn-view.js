import AbstractView from '../framework/view/abstract-view.js';

const createNewPointBtnViewTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewPointBtnView extends AbstractView {
  get template() {
    return createNewPointBtnViewTemplate();
  }

  setBtnClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#btnClickHandler);
  };

  #btnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}

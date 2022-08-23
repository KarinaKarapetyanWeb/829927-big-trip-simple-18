import { createElement } from '../render.js';

const createEventItemTemplate = () => '<li class="trip-events__item"></li>';

export default class EventItemView {
  #element = null;

  get template() {
    return createEventItemTemplate();
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

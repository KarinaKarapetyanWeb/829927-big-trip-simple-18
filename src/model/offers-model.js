import { offers } from '../mock/offer.js';

export default class OffersModel {
  #offers = offers;

  get offers() {
    return this.#offers;
  }
}

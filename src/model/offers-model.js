import { offers } from '../mock/offer.js';
import { getOffersByType } from '../utils/point.js';

export default class OffersModel {
  #offers = offers;

  get = (type) => getOffersByType(this.#offers, type);
}

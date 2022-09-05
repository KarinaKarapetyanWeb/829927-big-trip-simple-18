import { offers } from '../mock/offer.js';
import { getOffersByType } from '../utils.js';

export default class OffersModel {
  #offers = offers;
  // ВОПРОС: я не переписала функции на геттеры для консистентности, так как в случае с предложениями функция должна принимать аргумент, оставить стрелочную фунцию везде?
  get = (type) => getOffersByType(this.#offers, type);
}

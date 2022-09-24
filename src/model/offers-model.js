import Observable from '../framework/observable.js';
import { UpdateType, DataType } from '../const.js';
import { getOffersByType } from '../utils/point.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor(offersApiService) {
    super();
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#offers;
  }

  getOffersByPointType = (type) => getOffersByType(this.#offers, type);

  init = async () => {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers;
    } catch (err) {
      this.#offers = [];
    } finally {
      this._notify(UpdateType.INIT, DataType.OFFERS);
    }
  };
}

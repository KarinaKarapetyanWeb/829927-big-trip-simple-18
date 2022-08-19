import EventsView from '../view/events-view.js';
import EventItemView from '../view/event-item-view.js';
import PointFormView from '../view/point-form-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';
import { DEFAULT_TRIP_TYPE } from '../const.js';
import { getSelectedDestination, getSelectedOffers } from '../utils.js';

export default class EventsPresenter {
  eventListCopmonent = new EventsView();

  #createEventItem = (element, eventList, ...args) => {
    const eventItemComponent = new EventItemView();
    render(eventItemComponent, eventList.getElement());
    render(new element(...args), eventItemComponent.getElement());
  };

  init = (eventsContainer, PointsModel, DestinationsModel, OffersModel) => {
    this.eventsContainer = eventsContainer;
    this.pointsModel = PointsModel;
    this.eventPoints = [...PointsModel.get()];
    this.destinations = [...DestinationsModel.get()];
    this.offers = [...OffersModel.get(DEFAULT_TRIP_TYPE)];

    render(this.eventListCopmonent, this.eventsContainer);
    this.#createEventItem(PointFormView, this.eventListCopmonent, null, this.destinations, this.offers);

    for (let i = 0; i < this.eventPoints.length; i++) {
      // при показе формы редактирования - перезаписываем св-во this.offers для подгрузки предложений для типа точки
      this.offers = [...OffersModel.get(this.eventPoints[i].type)];

      const selectedDestination = getSelectedDestination(this.destinations, this.eventPoints[i].destination);
      const selectedOffers = getSelectedOffers(this.offers, this.eventPoints[i].offers);

      this.#createEventItem(PointView, this.eventListCopmonent, this.eventPoints[i], selectedDestination, selectedOffers);
      this.#createEventItem(PointFormView, this.eventListCopmonent, this.eventPoints[i], this.destinations, this.offers);
    }
  };
}

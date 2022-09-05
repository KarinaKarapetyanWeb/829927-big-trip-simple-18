import EventsView from '../view/events-view.js';
import EventItemView from '../view/event-item-view.js';
import PointFormView from '../view/point-form-view.js';
import PointView from '../view/point-view.js';
import NoPointView from '../view/no-point-view.js';
import { render } from '../render.js';
import { DEFAULT_TRIP_TYPE, ActionType } from '../const.js';
import { getSelectedDestination, getSelectedOffers, isEscKey } from '../utils.js';

export default class EventsPresenter {
  #eventListCopmonent = new EventsView();

  #eventsContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #eventPoints = [];
  #destinations = [];
  #offers = [];

  constructor(eventsContainer, PointsModel, DestinationsModel, OffersModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = PointsModel;
    this.#offersModel = OffersModel;
    this.#destinationsModel = DestinationsModel;
  }

  #renderEventItem = (listItem, element) => {
    render(listItem, this.#eventListCopmonent.element);
    render(element, listItem.element);
  };

  #renderAddPointForm = (point, destinations, offers) => {
    const listItemComponent = new EventItemView();
    const pointFormComponent = new PointFormView(ActionType.ADD, point, destinations, offers);
    this.#renderEventItem(listItemComponent, pointFormComponent);
  };

  #renderPoint = (point, destination, allDestinations, offers, allOffers) => {
    const listItemComponent = new EventItemView();
    const pointComponent = new PointView(point, destination, offers);
    const pointFormComponent = new PointFormView(ActionType.EDIT, point, allDestinations, allOffers);

    const replaceCardToForm = () => {
      listItemComponent.element.replaceChild(pointFormComponent.element, pointComponent.element);
    };

    const replaceFormToCard = () => {
      listItemComponent.element.replaceChild(pointComponent.element, pointFormComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (isEscKey(evt)) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointFormComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    this.#renderEventItem(listItemComponent, pointComponent);
  };

  #renderEvents = () => {
    if (!this.#eventPoints.length) {
      render(new NoPointView(), this.#eventsContainer);
      return;
    }

    render(this.#eventListCopmonent, this.#eventsContainer);
    this.#renderAddPointForm(null, this.#destinations, this.#offers);
    for (let i = 0; i < this.#eventPoints.length; i++) {
      // при показе формы редактирования - перезаписываем св-во this.offers для подгрузки предложений для типа точки
      this.#offers = [...this.#offersModel.get(this.#eventPoints[i].type)];

      const selectedDestination = getSelectedDestination(this.#destinations, this.#eventPoints[i].destination);
      const selectedOffers = getSelectedOffers(this.#offers, this.#eventPoints[i].offers);

      this.#renderPoint(this.#eventPoints[i], selectedDestination, this.#destinations, selectedOffers, this.#offers);
    }
  };

  init = () => {
    this.#eventPoints = [...this.#pointsModel.get()];
    this.#destinations = [...this.#destinationsModel.get()];
    this.#offers = [...this.#offersModel.get(DEFAULT_TRIP_TYPE)];

    this.#renderEvents();
  };
}

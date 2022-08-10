import EventsView from '../view/events-view.js';
import EventItemView from '../view/event-item-view.js';
import AddFormView from '../view/add-form-view.js';
// import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class EventsPresenter {
  eventListCopmonent = new EventsView();

  #createEventItem = (element, eventList) => {
    const eventItemComponent = new EventItemView();
    render(eventItemComponent, eventList.getElement());
    render(new element(), eventItemComponent.getElement());
  };

  init = (eventsContainer) => {
    this.eventsContainer = eventsContainer;
    render(this.eventListCopmonent, this.eventsContainer);
    this.#createEventItem(AddFormView, this.eventListCopmonent);
    for (let i = 0; i < 3; i++) {
      this.#createEventItem(PointView, this.eventListCopmonent);
    }
  };
}

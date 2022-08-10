import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import { render } from './render.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripControlsContainer = siteHeaderElement.querySelector(
  '.trip-controls__filters'
);
const tripEventsContainer = siteMainElement.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter();

render(new FilterView(), tripControlsContainer);
render(new SortView(), tripEventsContainer);

eventsPresenter.init(tripEventsContainer);

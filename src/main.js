import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import { render } from './render.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripControlsContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const eventsPresenter = new EventsPresenter(tripEventsContainerElement, pointsModel, destinationsModel, offersModel);

render(new FilterView(), tripControlsContainerElement);
render(new SortView(), tripEventsContainerElement);

eventsPresenter.init();

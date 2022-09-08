import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import NewEventBtnView from './view/new-event-btn-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import { render } from './framework/render.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { generateFilter } from './mock/filter.js';
import { generateSortOptions } from './mock/sort.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.page-header');
const tripControlsContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');
const newEventsBtnContainerElement = siteHeaderElement.querySelector('.trip-main');
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const eventsPresenter = new EventsPresenter(tripEventsContainerElement, pointsModel, destinationsModel, offersModel);

const points = pointsModel.get();

const filters = generateFilter(points);
const sortOptions = generateSortOptions(points);

render(new FilterView(filters), tripControlsContainerElement);
render(new SortView(sortOptions), tripEventsContainerElement);
render(new NewEventBtnView(), newEventsBtnContainerElement);

eventsPresenter.init();

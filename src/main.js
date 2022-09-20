import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsPresenter from './presenter/events-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import NewPointBtnView from './view/new-event-btn-view';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const filterContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');
const eventsContainerElement = siteMainElement.querySelector('.trip-events');
const newEventsBtnContainerElement = siteHeaderElement.querySelector('.trip-main');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const newPointButtonComponent = new NewPointBtnView();

const filterPresenter = new FilterPresenter(filterContainerElement, filterModel, pointsModel);
const eventsPresenter = new EventsPresenter(eventsContainerElement, pointsModel, destinationsModel, offersModel, filterModel);

render(newPointButtonComponent, newEventsBtnContainerElement);

const handleNewTaskFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewTaskButtonClick = () => {
  eventsPresenter.createPoint(handleNewTaskFormClose);
  newPointButtonComponent.element.disabled = true;
};

newPointButtonComponent.setBtnClickHandler(handleNewTaskButtonClick);

filterPresenter.init();
eventsPresenter.init();

import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsPresenter from './presenter/events-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import NewPointBtnView from './view/new-event-btn-view';
import PointsApiService from './service/points-api-service.js';
import DestinationsApiService from './service/destinations-api-service.js';
import OffersApiService from './service/offers-api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteMainElement = document.querySelector('.page-main');
const filterContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');
const eventsContainerElement = siteMainElement.querySelector('.trip-events');
const newEventsBtnContainerElement = siteHeaderElement.querySelector('.trip-main');

const newPointButtonComponent = new NewPointBtnView();

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(filterContainerElement, filterModel, pointsModel);
const eventsPresenter = new EventsPresenter(eventsContainerElement, pointsModel, destinationsModel, offersModel, filterModel);

const handleNewTaskFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewTaskButtonClick = () => {
  eventsPresenter.createPoint(handleNewTaskFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, newEventsBtnContainerElement);
newPointButtonComponent.setBtnClickHandler(handleNewTaskButtonClick);

newPointButtonComponent.element.disabled = true;

filterPresenter.init();
eventsPresenter.init();

Promise.all([destinationsModel.init(), offersModel.init(), pointsModel.init()]).finally(() => {
  newPointButtonComponent.element.disabled = false;
});

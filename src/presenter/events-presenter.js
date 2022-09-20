import { generateSortOptions } from '../mock/sort.js';
import EventPresenter from './event-presenter.js';
import CreateEventPresenter from './create-event-presenter.js';
import NewPointBtnView from '../view/new-event-btn-view';
import SortView from '../view/sort-view.js';
import EventsView from '../view/events-view.js';
import NoPointView from '../view/no-point-view.js';
import { render, remove } from '../framework/render.js';
import { DEFAULT_SORT_TYPE, SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortPoints } from '../utils/sort.js';
import { filter } from '../utils/filter.js';

export default class EventsPresenter {
  #sortOptions = generateSortOptions();
  #currentSortType = DEFAULT_SORT_TYPE;
  #currentFilterType = FilterType.EVERYTHING;

  #eventListCopmonent = new EventsView();
  #newPointBtnView = new NewPointBtnView();
  #noPointComponent = null;
  #sortComponent = null;

  #eventsContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #eventPresenter = new Map();

  #pointNewPresenter = null;

  constructor(eventsContainer, pointsModel, destinationsModel, offersModel, filterModel) {
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new CreateEventPresenter(this.#eventListCopmonent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#currentFilterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return sortPoints(filteredPoints, SortType.DAY);
      case SortType.PRICE:
        return sortPoints(filteredPoints, SortType.PRICE);
    }

    return sortPoints(filteredPoints, DEFAULT_SORT_TYPE);
  }

  init = () => {
    this.#newPointBtnView.setBtnClickHandler(this.#handleNewPointClick);

    this.#renderEventsBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#sortOptions, this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#eventsContainer);
  };

  #renderAddPointForm = () => {
    this.#handleModeChange();

    const createEventPresenter = new CreateEventPresenter(this.#eventListCopmonent.element);
    createEventPresenter.init(this.#destinationsModel, this.#offersModel);
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#currentFilterType);
    render(this.#noPointComponent, this.#eventsContainer);
  };

  #renderPoint = (point, destinations, offers) => {
    const eventPresenter = new EventPresenter(this.#eventListCopmonent.element, this.#handleViewAction, this.#handleModeChange);
    eventPresenter.init(point, destinations, offers);

    this.#eventPresenter.set(point.id, eventPresenter);
  };

  #renderPoints = (points, destinations, offers) => {
    points.forEach((point) => this.#renderPoint(point, destinations, offers));
  };

  #clearEventsBoard = ({ resetSortType = false } = {}) => {
    this.#pointNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  };

  #renderEventsBoard = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    render(this.#eventListCopmonent, this.#eventsContainer);

    this.#renderPoints(points, this.#destinationsModel, this.#offersModel);
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(this.#destinationsModel, this.#offersModel, callback);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventsBoard();
    this.#renderEventsBoard();
  };

  #handleNewPointClick = () => {
    this.#renderAddPointForm();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenter.get(data.id).init(data, this.#destinationsModel, this.#offersModel);
        break;
      case UpdateType.MINOR:
        this.#clearEventsBoard();
        this.#renderEventsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearEventsBoard({ resetSortType: true });
        this.#renderEventsBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };
}

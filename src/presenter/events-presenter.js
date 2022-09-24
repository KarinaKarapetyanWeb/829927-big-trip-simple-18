import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import EventPresenter from './event-presenter.js';
import CreateEventPresenter from './create-event-presenter.js';
import SortView from '../view/sort-view.js';
import EventsView from '../view/events-view.js';
import NoPointView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { DEFAULT_SORT_TYPE, SortType, UpdateType, UserAction, FilterType, DataType, TimeBlockLimit } from '../const.js';
import { sortPoints, generateSortOptions } from '../utils/sort.js';
import { filter } from '../utils/filter.js';

export default class EventsPresenter {
  #sortOptions = generateSortOptions();
  #currentSortType = DEFAULT_SORT_TYPE;
  #currentFilterType = FilterType.EVERYTHING;

  #eventListCopmonent = new EventsView();
  #loadingComponent = new LoadingView();

  #noPointComponent = null;
  #sortComponent = null;

  #eventsContainerElement = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #eventPresenter = new Map();
  #pointNewPresenter = null;

  #isPointsLoading = true;
  #isOffersLoading = true;
  #isDestinationsLoading = true;

  #uiBlocker = new UiBlocker(TimeBlockLimit.LOWER_LIMIT, TimeBlockLimit.UPPER_LIMIT);

  constructor(eventsContainerElement, pointsModel, destinationsModel, offersModel, filterModel) {
    this.#eventsContainerElement = eventsContainerElement;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new CreateEventPresenter(this.#eventListCopmonent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);

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
    this.#renderEventsBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#sortOptions, this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#eventsContainerElement, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#currentFilterType);
    render(this.#noPointComponent, this.#eventsContainerElement);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#eventsContainerElement);
  };

  #renderPoint = (point) => {
    const eventPresenter = new EventPresenter(this.#eventListCopmonent.element, this.#handleViewAction, this.#handleModeChange);
    eventPresenter.init(point, this.#destinationsModel, this.#offersModel);

    this.#eventPresenter.set(point.id, eventPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #clearEventsBoard = ({ resetSortType = false } = {}) => {
    this.#pointNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  };

  #renderEventsBoard = () => {
    if (this.#isPointsLoading || this.#isOffersLoading || this.#isDestinationsLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const destinations = [...this.#destinationsModel.destinations];
    render(this.#eventListCopmonent, this.#eventsContainerElement);

    if (points.length === 0 || destinations.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    this.#renderPoints(points);
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(this.#destinationsModel, this.#offersModel, callback);
  };

  #toggleLoadingIndicatorsByType = (type) => {
    if (type === DataType.POINTS) {
      this.#isPointsLoading = false;
    }
    if (type === DataType.OFFERS) {
      this.#isOffersLoading = false;
    }
    if (type === DataType.DESTINATIONS) {
      this.#isDestinationsLoading = false;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventsBoard();
    this.#renderEventsBoard();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#eventPresenter.get(update.id).setSaving();

        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#eventPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#pointNewPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#eventPresenter.get(update.id).setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#eventPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#toggleLoadingIndicatorsByType(data);

        if (!this.#isPointsLoading && !this.#isOffersLoading && !this.#isDestinationsLoading) {
          remove(this.#loadingComponent);
          this.#renderEventsBoard();
        }
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };
}

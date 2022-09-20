import { getTodayDate } from './utils/date.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const POINTS_COUNT = 5;

const DEFAULT_TRIP_TYPE = 'taxi';

const ActionType = {
  EDIT: 'edit',
  CREATE: 'create',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const DEFAULT_SORT_TYPE = SortType.DAY;

const BLANK_POINT = {
  basePrice: null,
  dateFrom: getTodayDate(),
  dateTo: getTodayDate(),
  destination: null,
  offers: [],
  type: DEFAULT_TRIP_TYPE,
};

const FilterType = {
  FUTURE: 'future',
  EVERYTHING: 'everything',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { POINT_TYPES, POINTS_COUNT, DEFAULT_TRIP_TYPE, ActionType, BLANK_POINT, FilterType, SortType, Mode, DEFAULT_SORT_TYPE, UserAction, UpdateType };

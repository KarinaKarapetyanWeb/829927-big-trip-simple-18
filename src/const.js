import { getTodayDate } from './utils/date.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const POINTS_COUNT = 5;

const DEFAULT_TRIP_TYPE = 'taxi';

const ActionType = {
  EDIT: 'edit',
  ADD: 'add',
};

const BLANK_POINT = {
  basePrice: null,
  dateFrom: getTodayDate(),
  dateTo: getTodayDate(),
  destination: null,
  offers: [],
  type: DEFAULT_TRIP_TYPE,
};

export { POINT_TYPES, POINTS_COUNT, DEFAULT_TRIP_TYPE, ActionType, BLANK_POINT };

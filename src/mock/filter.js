import { filter } from '../utils/filter.js';

export const generateFilterOptions = (points) =>
  Object.entries(filter).map(([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length,
  }));

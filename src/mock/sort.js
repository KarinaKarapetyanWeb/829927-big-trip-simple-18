import { options } from '../utils/sort.js';

export const generateSortOptions = (points) =>
  Object.entries(options).map(([optionName, filterPoints]) => ({
    name: optionName,
    sortedPoints: filterPoints(points),
  }));

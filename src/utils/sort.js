import { SortType } from '../const';
import dayjs from 'dayjs';

const options = {
  [SortType.DAY]: () => false,
  [SortType.EVENT]: () => true,
  [SortType.TIME]: () => true,
  [SortType.PRICE]: () => false,
  [SortType.OFFERS]: () => true,
};

const sortPoints = (points, sortType) => {
  switch (sortType) {
    case SortType.DAY:
      return points.sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)));
    case SortType.PRICE:
      return points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);
    default:
      return points;
  }
};

const generateSortOptions = () =>
  Object.entries(options).map(([optionName, isDisabledOption]) => ({
    name: optionName,
    disabled: isDisabledOption(optionName),
  }));

export { options, sortPoints, generateSortOptions };

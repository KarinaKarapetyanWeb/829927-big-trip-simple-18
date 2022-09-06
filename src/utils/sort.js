import { SortOptions } from '../const';

// пока сортировка не настроена

const options = {
  [SortOptions.DAY]: (points) => points,
  [SortOptions.EVENT]: (points) => points,
  [SortOptions.TIME]: (points) => points,
  [SortOptions.PRICE]: (points) => points,
  [SortOptions.OFFERS]: (points) => points,
};

export { options };

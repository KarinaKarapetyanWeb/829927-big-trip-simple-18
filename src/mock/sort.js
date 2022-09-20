import { options } from '../utils/sort.js';

export const generateSortOptions = () =>
  Object.entries(options).map(([optionName, isDisabledOption]) => ({
    name: optionName,
    disabled: isDisabledOption(optionName),
  }));

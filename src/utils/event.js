import { render } from '../framework/render.js';

export const renderEventListItem = (list, listItem, element, position) => {
  render(listItem, list, position);
  render(element, listItem.element);
};

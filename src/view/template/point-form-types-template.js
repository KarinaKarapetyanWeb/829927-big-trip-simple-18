import { POINT_TYPES } from '../../const.js';

const renderTypeOptionsTemplate = (options, currentOption) =>
  options
    .map(
      (option) =>
        `<div class="event__type-item">
            <input id="event-type-${option}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${option} ${currentOption === option ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${option}" for="event-type-${option}-1">${option}</label>
        </div>`
    )
    .join('');

export const createPointFormTypesTemplate = (type) =>
  `<div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
        <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${renderTypeOptionsTemplate(POINT_TYPES, type)}
        </fieldset>
    </div>
  </div>`;

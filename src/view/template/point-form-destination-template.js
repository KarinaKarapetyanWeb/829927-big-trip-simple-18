const renderDestinationOptions = (options) => {
  if (!options.length) {
    return '';
  }
  return options.map((option) => `<option value=${option.name}></option>`).join('');
};

export const createPointFormDestinationTemplate = (destinations, initialDestination) => {
  const destinationName = initialDestination !== null ? initialDestination.name : '';

  return `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${renderDestinationOptions(destinations)}
          </datalist>`;
};

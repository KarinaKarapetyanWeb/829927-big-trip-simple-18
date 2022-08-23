const renderDestinationPictures = (pictures) => {
  if (!pictures.length) {
    return '';
  }
  const destinationPictures = pictures.map((picture) => `<img class="event__photo" src=${picture.src} alt=${picture.description}>`);

  return `<div class="event__photos-container">
            <div class="event__photos-tape">${destinationPictures}</div>
          </div>`;
};

export const createPointFormDestinationInfoTemplate = (destination) => {
  const { description, pictures } = destination;
  const destinationDescription = description ? description : '';

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinationDescription}</p>
              ${renderDestinationPictures(pictures)}
          </section>`;
};

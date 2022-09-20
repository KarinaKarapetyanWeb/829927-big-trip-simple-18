export const createPointOffersTemplate = (offers) => {
  if (!offers.length) {
    return `<li class="event__offer">
              <span class="event__offer-title">No additional offers</span>
            </li>`;
  }
  return offers
    .map(
      (offer) =>
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          +€&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>`
    )
    .join('');
};

import { isOfferIsSelected } from '../../utils/point.js';

const renderOffersTemplate = (offers, selectedOffersId) =>
  offers
    .map((offer) => {
      const offerName = `event-offer-${offer.id}`;

      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="${offerName}" ${isOfferIsSelected(offer.id, selectedOffersId) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
        </label>
       </div>`;
    })
    .join('');

export const createPointFormOffersTemplate = (offers, selectedOffersId) =>
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${renderOffersTemplate(offers, selectedOffersId)}
    </div>
  </section>`;

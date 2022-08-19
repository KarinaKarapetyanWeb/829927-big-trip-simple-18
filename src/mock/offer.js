import { POINT_TYPES } from '../const.js';
import { getRandomInteger, getRandomItem, removeDuplicateId } from '../utils.js';
import { titles, OfferPrice, IdRange, MAX_OFFERS_COUNT } from './const.js';

const generateOffer = () => ({
  id: getRandomInteger(IdRange.MIN, IdRange.MAX),
  title: getRandomItem(titles),
  price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX),
});

const hasOffers = () => getRandomInteger(0, 1);

const offers = [];

for (const type of POINT_TYPES) {
  offers.push({
    type: type,
    offers: hasOffers() ? removeDuplicateId(Array.from({ length: MAX_OFFERS_COUNT }, generateOffer)) : [],
  });
}

export { offers };

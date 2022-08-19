import dayjs from 'dayjs';
import { getRandomInteger, getRandomItem, getOffersByType } from '../utils.js';
import { POINT_TYPES } from '../const.js';
// ВОПРОС: генерацию направлений и офферов я сделала в моках, а не модели, чтобы можно было выбрать рандомные id для точек маршрутов из уже сгенерированной структуры данных
// На ретроспективе по СД показывалось (http://joxi.ru/8AnwZ3oINZPnjr), что для генерации комментов в функцию generateComments передаются все фильмы и для этого связывались модели - мне показалось это значительным усложнением
import { destinations } from './destination.js';
import { offers } from './offer.js';
import { PointPrice, DaysRange, HoursRange } from './const.js';

const generateRandomDate = () => dayjs().add(getRandomInteger(DaysRange.MIN, DaysRange.MAX), 'day').add(getRandomInteger(HoursRange.MIN, HoursRange.MAX), 'hour');

const generatePrice = () => getRandomInteger(PointPrice.MIN, PointPrice.MAX);

const generateDates = () => {
  const date1 = generateRandomDate();
  const date2 = generateRandomDate();

  if (date2.isAfter(date1)) {
    return {
      dateFrom: date1.toISOString(),
      dateTo: date2.toISOString(),
    };
  }
  return {
    dateFrom: date2.toISOString(),
    dateTo: date1.toISOString(),
  };
};

const generateDestinationId = () => getRandomItem(destinations).id;

const generateOfferIds = (type) => {
  const offersByType = getOffersByType(offers, type);
  if (!offersByType.length) {
    return [];
  }
  const randomOffers = offersByType.slice(0, getRandomInteger(1, offersByType.length));
  const ids = randomOffers.map((offer) => offer.id);
  return ids;
};

const generateType = () => getRandomItem(POINT_TYPES);

const generatePoint = () => {
  const randomType = generateType();
  const randomDates = generateDates();

  return {
    basePrice: generatePrice(),
    dateFrom: randomDates.dateFrom,
    dateTo: randomDates.dateTo,
    destination: generateDestinationId(),
    offers: generateOfferIds(randomType),
    type: randomType,
  };
};

export { generatePoint };

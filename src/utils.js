import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomItem = (items) => items[getRandomInteger(0, items.length - 1)];

const getTodayDate = () => dayjs().toISOString();

const humanizeDate = (date) => dayjs(date).format('D MMM');

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

const formatTime = (date) => dayjs(date).format('HH:mm');

const formatFormDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const removeDuplicateId = (array) =>
  array.reduce((acc, n) => {
    const i = acc.findIndex((m) => m.id === n.id);
    if (!~i || !acc[i].checked) {
      acc.push(n);
      if (~i) {
        acc.splice(i, 1);
      }
    }
    return acc;
  }, []);

const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type).offers;

const getSelectedDestination = (destinations, destinationId) => destinations.find((item) => item.id === destinationId);

const getSelectedOffers = (offers, offersIds) => offers.filter((item) => offersIds.some((offerId) => offerId === item.id));

const isOfferIsSelected = (offerId, selectedOffersIds) => selectedOffersIds.includes(offerId);

export {
  getRandomInteger,
  getRandomItem,
  getTodayDate,
  humanizeDate,
  formatDate,
  formatTime,
  formatFormDate,
  removeDuplicateId,
  getOffersByType,
  getSelectedDestination,
  getSelectedOffers,
  isOfferIsSelected,
};

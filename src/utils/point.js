import dayjs from 'dayjs';

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

const getDestinationId = (destinations, destinationName) => destinations.find((item) => item.name === destinationName).id;

const getSelectedOffers = (offers, offersIds) => offers.filter((item) => offersIds.some((offerId) => offerId === item.id));

const isOfferIsSelected = (offerId, selectedOffersIds) => selectedOffersIds.includes(offerId);

const isStartDateNotExpired = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());

const isEndDateNotExpired = (dateTo) => dayjs(dateTo).isAfter(dayjs());

const isFutureEvent = (dateFrom, dateTo) => isStartDateNotExpired(dateFrom) || isEndDateNotExpired(dateTo);

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const isPricesEqual = (priceA, priceB) => (priceA === null && priceB === null) || priceA === priceB;

export { removeDuplicateId, getOffersByType, getSelectedDestination, getDestinationId, getSelectedOffers, isOfferIsSelected, isFutureEvent, isDatesEqual, isPricesEqual };

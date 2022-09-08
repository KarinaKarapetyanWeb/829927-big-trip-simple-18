import { getRandomInteger, getRandomItem } from '../utils/common.js';
import { removeDuplicateId } from '../utils/point.js';
import { descriptions, names, IdRange, MAX_DESTINATIONS_COUNT } from './const.js';

const generateDestinationDescription = () => getRandomItem(descriptions);

const generateDestinationName = () => getRandomItem(names);

const generateDestinationPictureSrc = () => `http://picsum.photos/300/200?r=${getRandomInteger(0, 1)}`;

const generateDestination = () => ({
  id: getRandomInteger(IdRange.MIN, IdRange.MAX),
  description: generateDestinationDescription(),
  name: generateDestinationName(),
  pictures: [
    {
      src: generateDestinationPictureSrc(),
      description: generateDestinationDescription(),
    },
  ],
});

const destinations = removeDuplicateId(Array.from({ length: MAX_DESTINATIONS_COUNT }, generateDestination));

export { destinations };

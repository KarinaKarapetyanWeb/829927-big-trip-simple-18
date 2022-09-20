import { getRandomInteger, getRandomItem } from '../utils/common.js';
import { removeDuplicateId } from '../utils/point.js';
import { descriptions, names, IdRange } from './const.js';

const generateDestinationDescription = () => getRandomItem(descriptions);

// const generateDestinationPictureSrc = () => `http://picsum.photos/300/200?r=${getRandomInteger(0, 1)}`;
const generateDestinationPictureSrc = () => `https://placekitten.com/200/${getRandomInteger(1, 100)}`;

const generateDestination = () => {
  const destinationsArray = [];
  names.forEach((name) =>
    destinationsArray.push({
      id: getRandomInteger(IdRange.MIN, IdRange.MAX),
      description: generateDestinationDescription(),
      name: name,
      pictures: [
        {
          src: generateDestinationPictureSrc(),
          description: generateDestinationDescription(),
        },
      ],
    })
  );
  return destinationsArray;
};

const destinations = removeDuplicateId(generateDestination());

export { destinations };

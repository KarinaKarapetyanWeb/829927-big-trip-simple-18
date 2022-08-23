import { generatePoint } from '../mock/point.js';
import { POINTS_COUNT } from '../const.js';

export default class PointsModel {
  #points = Array.from({ length: POINTS_COUNT }, generatePoint);

  get = () => this.#points;
}

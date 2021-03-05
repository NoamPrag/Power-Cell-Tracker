export type Position = { x: number; y: number };

export const zeroPosition: Position = { x: 0, y: 0 };

const getDistance = (p1: Position, p2: Position): number =>
  Math.hypot(p1.x - p2.x, p1.y - p2.y);

const getDistanceToOrigin = (point: Position): number =>
  getDistance(point, zeroPosition);

const averagePoint = (coordinates: Position[]): Position => {
  const sum: Position = coordinates.reduce(
    (acc: Position, curr: Position): Position => ({
      x: acc.x + curr.x,
      y: acc.y + curr.y,
    }),
    zeroPosition
  );
  return {
    x: sum.x / coordinates.length,
    y: sum.y / coordinates.length,
  };
};

const standardDeviation = (
  distances: number[],
  averagePointDistance: number
): number =>
  Math.sqrt(
    distances.reduce(
      (acc: number, curr: number): number =>
        acc + Math.pow(averagePointDistance - curr, 2),
      0
    ) / distances.length
  );

export const calcAccuracy = (coordinates: Position[]): number =>
  parseFloat(getDistance(averagePoint(coordinates), zeroPosition).toFixed(2));

export const calcPrecision = (
  distances: number[],
  averagePointDistance: number
): number =>
  parseFloat(standardDeviation(distances, averagePointDistance).toFixed(2));

const innerPortRadius: number = 17;
const calcInInnerPort = (distance: number): boolean =>
  distance < innerPortRadius;

export const accuracyPrecision = (
  coordinates: Position[]
): [number, number] => {
  const accuracy: number = calcAccuracy(coordinates);

  const precision: number = calcPrecision(
    coordinates.map(getDistanceToOrigin),
    accuracy
  );

  return [accuracy, precision];
};

export interface AnalyticData {
  readonly accuracy: number;
  readonly precision: number;
  readonly inInnerPort: boolean[];
}

export const getAnalyticData = (coordinates: Position[]): AnalyticData => {
  const accuracy: number = calcAccuracy(coordinates);

  const distances: number[] = coordinates.map((coordinate: Position): number =>
    getDistance(coordinate, zeroPosition)
  );

  const precision: number = calcPrecision(distances, accuracy);

  const inInnerPort: boolean[] = distances.map((distance: number): boolean =>
    calcInInnerPort(distance)
  );

  return { accuracy, precision, inInnerPort };
};

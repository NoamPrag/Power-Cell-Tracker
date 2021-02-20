import { Position } from "./Burst";

export const zeroPosition: Position = { x: 0, y: 0 };

export const getDistance = (p1: Position, p2: Position): number =>
  Math.hypot(p1.x - p2.x, p1.y - p2.y);

const averagePoint = (coordinates: Position[]): Position => {
  const sum: Position = coordinates.reduce(
    (acc: Position, curr: Position): Position => ({
      x: acc.x + curr.x,
      y: acc.y + curr.y,
    })
  );
  return {
    x: sum.x / coordinates.length,
    y: sum.y / coordinates.length,
  };
};

const averageDistance = (
  coordinates: Position[],
  referencePoint: Position
): number =>
  coordinates.reduce(
    (acc: number, curr: Position): number =>
      acc + getDistance(curr, referencePoint),
    0
  ) / coordinates.length;

const standardDeviation = (
  coordinates: Position[],
  referencePoint: Position
): number => {
  const distances: number[] = coordinates.map((p: Position): number =>
    getDistance(p, referencePoint)
  );

  const averageDistance: number = distances.reduce(
    (acc: number, curr: number): number => acc + curr,
    0
  );

  return Math.sqrt(
    distances.reduce(
      (acc: number, curr: number): number =>
        acc + Math.pow(averageDistance - curr, 2),
      0
    ) / coordinates.length
  );
};

// const sigmoid = (l: number, k: number, x0: number, value: number): number =>
//   l / (1 + Math.pow(Math.E, -k * (value - x0)));

const sigmoid = (l: number, k: number, x0: number, value: number): number =>
  l / (1 + Math.exp(-k * (value - x0)));

// export const accuracy = (coordinates: Position[]): number =>
//   100 * (1 - sigmoid(0.5, 4, 1, averageDistance(coordinates, zeroPosition)));
export const accuracy = (coordinates: Position[]): number =>
  averageDistance(coordinates, zeroPosition);

export const precision = (coordinates: Position[]): number =>
  100 *
  (1 -
    sigmoid(
      1.2,
      4,
      1,
      standardDeviation(coordinates, averagePoint(coordinates))
    ));

export const inInnerPort = (position: Position): boolean =>
  getDistance(position, zeroPosition) < 10;

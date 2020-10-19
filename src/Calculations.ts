import { Position } from "./Burst";

export const zeroPosition: Position = { x: 0, y: 0 };

export const getDistance = (p1: Position, p2: Position): number =>
  Math.hypot(p1.x - p2.x, p1.y - p2.y);

const averagePoint = (coordinates: Position[]): Position => {
  let sum = coordinates.reduce(
    (acc, curr): Position => ({ x: acc.x + curr.x, y: acc.y + curr.y })
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
    (acc: number, curr: Position): number => acc + getDistance(curr, referencePoint),
    0
  ) / coordinates.length;

const standardDeviation = (
  coordinates: Position[],
  referencePoint: Position
) => {
  const average: number = averageDistance(coordinates, referencePoint);
  const distances: number[] = coordinates.map((p) =>
    getDistance(p, referencePoint)
  );

  return Math.sqrt(
    distances.reduce(
      (acc: number, curr: number): number => acc + Math.pow(curr - average, 2),
      0
    ) / coordinates.length
  );
};


const sigmoid = (l: number, k: number, x0: number, value: number): number => l / (1 + Math.pow(Math.E, -k*(value - x0)));


export const accuracy = (coordinates: Position[]) =>
  100 * (1 - sigmoid(0.5, 4, 1, averageDistance(coordinates, zeroPosition)));

export const precision = (coordinates: Position[]) =>
  100 * (1 - sigmoid(1, 4, 1, standardDeviation(coordinates, averagePoint(coordinates))));
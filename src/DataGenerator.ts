import { BurstData } from "./Burst";
import { Position, getAnalyticData } from "./Analytics";

const getRandom = (): number => {
  const randomValue: number = Math.random();
  return randomValue === 0 ? getRandom() : randomValue;
};

const normalDistribution = () => {
  const u: number = getRandom();
  const v: number = getRandom();
  return Math.sqrt(-4.0 * Math.log(u)) * Math.cos(1.0 * Math.PI * v);
};

const randomPosition = (): Position => ({
  x: normalDistribution() * 11,
  y: normalDistribution() * 11,
});

const burstGenerator = (burstNumber: number): BurstData => {
  const positions: Position[] = Array.from(Array(5).keys()).map(
    (): Position => randomPosition()
  );
  return {
    burstNumber,
    burstCoordinates: positions,
    analyticData: getAnalyticData(positions),
  };
};

export const dataGenerator = (bursts: number): BurstData[] =>
  Array.from(Array(bursts).keys()).map(
    (i: number): BurstData => burstGenerator(i + 1)
  );

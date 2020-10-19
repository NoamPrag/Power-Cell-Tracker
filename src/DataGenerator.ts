import { BurstData, Position, BurstCoordinates } from "./Burst";

const getRandom = (): number => {
  const randomValue = Math.random();
  return randomValue === 0 ? getRandom() : randomValue;
};

const normalDistribution = () => {
  const u = getRandom();
  const v = getRandom();
  return Math.sqrt(-4.0 * Math.log(u)) * Math.cos(1.0 * Math.PI * v);
};

const randomPosition = (): Position => ({
  x: normalDistribution(),
  y: normalDistribution(),
});

const burstGenerator = (burstNumber: number): BurstData => {
  const array: BurstCoordinates = [
    randomPosition(),
    randomPosition(),
    randomPosition(),
    randomPosition(),
    randomPosition(),
  ];
  return {
    burstNumber,
    burstCoordinates: array,
  };
};

export const dataGenerator = (bursts: number): BurstData[] => {
  let burstArray: BurstData[] = [];
  for (let i = 1; i <= bursts; i++) {
    burstArray.push(burstGenerator(i));
  }
  return burstArray;
};

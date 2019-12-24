import { BigNumber } from 'ethers/utils';

export enum Move {
  Null = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
  Spock = 4,
  Lizard = 5,
}

export const MoveLabel = {
  [Move.Null]: '',
  [Move.Rock]: 'Rock',
  [Move.Paper]: 'Paper',
  [Move.Scissors]: 'Scissors',
  [Move.Spock]: 'Spock',
  [Move.Lizard]: 'Lizard',
};

export const validateMove = (move: Move): true | string => {
  return Number(move) !== Number(Move.Null) || 'Invalid move';
};

export interface PlayerOneData {
  address: string;
  commitment: BigNumber;
  move?: Move;
  salt?: BigNumber;
}

export interface PlayerTwoData {
  address: string;
  move: Move;
}

export interface Game {
  address: string;
  playerOne: PlayerOneData;
  playerTwo: PlayerTwoData;
  stake: BigNumber;
  lastAction: Date;
  timeoutMs: number;
  result: string;
}

export const emptyGame: Game = {
  address: '',
  playerOne: {
    address: '',
    commitment: new BigNumber(-1),
  },
  playerTwo: {
    address: '',
    move: Move.Null,
  },
  stake: new BigNumber(0),
  lastAction: new Date(0),
  timeoutMs: 0,
  result: '',
};

export function canPlayerOneClaimTimeout(
  { playerTwo, lastAction, timeoutMs, stake }: Game,
  currentDate: Date
): boolean {
  if (Number(stake) === 0) {
    // Game is already settled
    return false;
  }

  if (playerTwo.move !== Move.Null) {
    // Player 2 has already played
    return false;
  }

  return currentDate.getTime() - lastAction.getTime() >= timeoutMs;
}

export function canPlayerTwoClaimTimeout(
  { playerTwo, lastAction, timeoutMs, stake }: Game,
  currentDate: Date
): boolean {
  if (Number(stake) === 0) {
    // Game is already settled
    return false;
  }

  if (playerTwo.move === Move.Null) {
    // Player 2 hasn't played yet
    return false;
  }

  return currentDate.getTime() - lastAction.getTime() >= timeoutMs;
}

export function isSettled({ stake }: Game): boolean {
  return Number(stake) === 0;
}

export function hasPlayerTwoPlayed({ playerTwo }: Game): boolean {
  return playerTwo.move !== Move.Null;
}

export function secondsUntilTimeout(
  { lastAction, timeoutMs }: Game,
  currentDate: Date
): number {
  return Math.round(
    (timeoutMs - (currentDate.getTime() - lastAction.getTime())) / 1000
  );
}

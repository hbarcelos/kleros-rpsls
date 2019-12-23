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
  stake: number;
  lastAction: Date;
  timeoutMs: number;
}

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

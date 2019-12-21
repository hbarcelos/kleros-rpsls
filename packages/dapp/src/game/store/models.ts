export enum Move {
  Null = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
  Spock = 4,
  Lizard = 5,
}

export interface PlayerOneData {
  address: string;
  move: Move;
  salt: string;
}

export interface PlayerTwoData {
  address: string;
  move: Move;
}

export interface Match {
  address: string;
  playerOne: PlayerOneData;
  playerTwo: PlayerTwoData;
  stake: number;
}

import { Contract } from 'ethers';
import { Game, Move } from '../game/store/models';

const secondsToMiliseconds = (seconds: number): number => seconds * 1000;

export default async function fetchGameData(contract: Contract): Promise<Game> {
  const [
    playerOneAddress,
    playerOneCommitment,
    playerTwoAddress,
    playerTwoMove,
    stake,
    lastAction,
    timeoutSeconds,
  ] = await Promise.all([
    contract.j1(),
    contract.c1Hash(),
    contract.j2(),
    contract.c2(),
    contract.stake(),
    contract.lastAction(),
    contract.TIMEOUT(),
  ]);

  return {
    address: contract.address,
    playerOne: {
      address: playerOneAddress,
      commitment: playerOneCommitment,
    },
    playerTwo: {
      address: playerTwoAddress,
      move: playerTwoMove as Move,
    },
    stake,
    lastAction: new Date(secondsToMiliseconds(Number(lastAction))),
    timeoutMs: secondsToMiliseconds(timeoutSeconds),
  };
}

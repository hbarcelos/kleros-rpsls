import { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { bigNumberify } from 'ethers/utils';
import { RPS } from '../../contracts.json';
import useContract from '../../shared/hooks/useContract';
import { Game, Move } from '../store/models';

export interface UseGameDataParameters {
  address: string;
}

const secondsToMiliseconds = (seconds: number): number => seconds * 1000;

export default function useGameData({ address }: UseGameDataParameters): Game {
  const contract = useContract({ abi: RPS.abi, address });

  const [data, setData] = useState({
    playerOneAddress: '',
    playerOneCommitment: bigNumberify('-1'),
    playerTwoAddress: '',
    playerTwoMove: 0,
    stake: 0,
    lastAction: new Date(0),
    timeoutSeconds: 0,
  });

  useEffect(() => {
    async function fetchContractData(contract: Contract): Promise<void> {
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

      setData({
        playerOneAddress,
        playerOneCommitment,
        playerTwoAddress,
        playerTwoMove,
        stake,
        lastAction,
        timeoutSeconds,
      });
    }

    fetchContractData(contract);
  }, [contract]);

  const {
    playerOneAddress,
    playerOneCommitment,
    playerTwoAddress,
    playerTwoMove,
    stake,
    lastAction,
    timeoutSeconds,
  } = data;

  return {
    address,
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

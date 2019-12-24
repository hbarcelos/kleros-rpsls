import { useEffect, useContext } from 'react';
import { RPS } from '../../contracts.json';
import useContract from '../../shared/hooks/useContract';
import ConnectGameContext from '../contexts/ConnectGameContext';
import { setIsLoading, setGameData } from '../store/connectGameSlice';
import fetchGameData from '../../service/fetchGameData';

export interface UseFetchGameDataParameters {
  address: string;
}

export default function useFetchGameData({
  address,
}: UseFetchGameDataParameters): void {
  const [, dispatch] = useContext(ConnectGameContext);
  const contract = useContract({ abi: RPS.abi, address });

  useEffect(() => {
    dispatch(setIsLoading(true));

    fetchGameData(contract)
      .then(gameData => {
        dispatch(setGameData(gameData));
      })
      .finally(() => {
        dispatch(setIsLoading(false));
      });
  }, [contract, dispatch]);
}

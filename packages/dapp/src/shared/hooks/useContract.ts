import { useEtherProvider } from 'use-ether-provider';
import { Contract } from 'ethers';

export default function useContract(address: string, abi: any): Contract {
  const provider = useEtherProvider();

  return new Contract(address, abi, provider!);
}

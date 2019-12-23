import { useState, useEffect } from 'react';
import { useEtherProvider, useAccount } from 'use-ether-provider';
import { Contract } from 'ethers';

export type ContractInfo = { abi: any } & (
  | {
      addresses: Record<string, string>;
    }
  | {
      address: string;
    }
);

export default function useContract(contractInfo: ContractInfo): Contract {
  const provider = useEtherProvider();
  if (!provider) {
    throw new Error('Provider not set');
  }

  const accountAddress = useAccount(provider);

  const networkId = provider.network.chainId;
  const contractAddress =
    'address' in contractInfo
      ? contractInfo.address
      : contractInfo.addresses[networkId];
  const { abi } = contractInfo;

  const [contract, setContract] = useState<Contract>(
    new Contract(contractAddress, abi, provider).connect(
      provider.getSigner(accountAddress)
    )
  );

  useEffect(() => {
    if (!contractAddress) {
      throw new Error(`Contract does not exist on network ${networkId}`);
    }

    setContract(
      new Contract(contractAddress, abi, provider).connect(
        provider.getSigner(accountAddress)
      )
    );
  }, [contractAddress, abi, accountAddress, networkId, provider]);

  return contract;
}

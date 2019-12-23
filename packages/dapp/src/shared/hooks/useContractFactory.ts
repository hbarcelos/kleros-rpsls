import { useState, useEffect } from 'react';
import { useEtherProvider, useAccount } from 'use-ether-provider';
import { ContractFactory } from 'ethers';

export interface ContractFactoryInfo {
  bytecode: any;
  abi: any;
}

export default function useContractFactory({
  bytecode,
  abi,
}: ContractFactoryInfo): ContractFactory {
  const provider = useEtherProvider();
  if (!provider) {
    throw new Error('Provider not set');
  }

  const defaultAddress = useAccount(provider);

  const [contractFactory, setContractFactory] = useState<ContractFactory>(
    new ContractFactory(
      abi,
      bytecode.object,
      provider.getSigner(defaultAddress)
    )
  );

  useEffect(() => {
    setContractFactory(
      new ContractFactory(
        abi,
        bytecode.object,
        provider.getSigner(defaultAddress)
      )
    );
  }, [abi, bytecode.object, defaultAddress, provider]);

  return contractFactory;
}

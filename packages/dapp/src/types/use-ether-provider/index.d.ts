declare module 'use-ether-provider' {
  import * as React from 'react';
  import { Web3Provider } from 'ethers/providers';

  export interface EtherProviderProps {
    networks?: number[];
    backupJsonRpcUrl?: string;
    ms?: number;
    children: JSX.Element;
  }

  export const EtherProvider: React.SFC<EtherProviderProps>;

  export const useEtherProvider: () => Web3Provider | null;

  export const useAccount: (provider: Web3Provider) => string;
}

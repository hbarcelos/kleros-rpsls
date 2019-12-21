import { useState, useEffect } from 'react';
import { useEtherProvider } from 'use-ether-provider';
import { Web3Provider } from 'ethers/providers';

export type ProviderStatus =
  | { state: 'pending' }
  | { state: 'fulfilled'; supportsNetwork: boolean }
  | { state: 'rejected'; reason: Error };

export default function useProviderStatus({
  supportedNetworks,
  timeoutLimitMs = 10000,
}: {
  supportedNetworks: number[];
  timeoutLimitMs?: number;
}): ProviderStatus {
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>({
    state: 'pending',
  });

  const provider = useEtherProvider();

  useEffect(() => {
    async function checkStatus(provider: Web3Provider): Promise<void> {
      try {
        await provider.listAccounts();

        const networkId = provider.network.chainId;
        const supportsNetwork = supportedNetworks.includes(networkId);
        setProviderStatus({
          state: 'fulfilled',
          supportsNetwork,
        });
      } catch (err) {
        setProviderStatus({
          state: 'rejected',
          reason: err,
        });
      }
    }

    if (provider) {
      checkStatus(provider);
    } else {
      const handler = setTimeout(() => {
        setProviderStatus({
          state: 'rejected',
          reason: new Error('Could not connect to the provider.'),
        });
      }, timeoutLimitMs);

      return (): void => clearTimeout(handler);
    }
  }, [provider, supportedNetworks, timeoutLimitMs]);

  return providerStatus;
}

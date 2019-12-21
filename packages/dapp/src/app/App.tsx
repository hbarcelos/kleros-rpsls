import React from 'react';
import { EtherProvider } from 'use-ether-provider';
import { allNetworks, pollingInterval, jsonRpcUrl } from './config';
import ProviderGateway from './ProviderGateway';
import Account from './Account';
import MainRouter from './router/MainRouter';

export default function App(): React.ReactElement {
  return (
    <EtherProvider
      networks={allNetworks}
      backupJsonRpcUrl={jsonRpcUrl}
      ms={pollingInterval}
    >
      <ProviderGateway>
        <MainRouter></MainRouter>
      </ProviderGateway>
    </EtherProvider>
  );
}

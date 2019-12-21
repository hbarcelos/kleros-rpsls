import React from 'react';
import { supportedNetworks } from './config';
import useProviderStatus from '../shared/hooks/useProviderStatus';
import ProviderError from '../fragments/ProviderError';
import BlockingLoader from '../fragments/BlockingLoader';

const ProviderGateway: React.SFC<{}> = ({ children }) => {
  const status = useProviderStatus({ supportedNetworks });

  return status.state === 'pending' ? (
    <BlockingLoader />
  ) : status.state === 'rejected' ? (
    <ProviderError message={status.reason.message} />
  ) : status.supportsNetwork ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <ProviderError message="Unsupported network :(" />
  );
};

export default ProviderGateway;

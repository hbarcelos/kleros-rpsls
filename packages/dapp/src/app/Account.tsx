import React from 'react';
import { useEtherProvider, useAccount } from 'use-ether-provider';

const Account: React.SFC<{}> = () => {
  const provider = useEtherProvider();
  const myAddress = useAccount(provider!);

  return <div>{myAddress}</div>;
};

export default Account;

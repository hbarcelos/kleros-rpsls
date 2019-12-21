export const networks = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  CUSTOM: 5577,
};

export const allNetworks = Object.values(networks);
export const supportedNetworks = [networks.RINKEBY, networks.CUSTOM];

const FIVE_SECONDS_IN_MILIS = 5000;

export const pollingInterval = FIVE_SECONDS_IN_MILIS;

export const jsonRpcUrl = 'http://localhost:8485';

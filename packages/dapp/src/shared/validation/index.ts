export const validateAddress = (address: string): true | string =>
  /^0x[a-fA-F0-9]{40}$/.test(address) || 'Invalid address';

export const validatePositiveNumber = (n: number): true | string =>
  n > 0 || 'Must be greater than zero';

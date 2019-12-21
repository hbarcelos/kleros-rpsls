import { BigNumber } from 'ethers/utils';

export default function safeRandomNumber(): BigNumber {
  // Creates 8 x 32-bit integers
  const array = new Uint32Array(8);
  // Assign criptographically secure values for each item in the array
  window.crypto.getRandomValues(array);

  // Concatenates the string representation of the numbers together
  const str = array.reduce((acc, current) => acc + String(current), '');

  // Returns a BigNumber with at most 256 bits
  return new BigNumber(str).maskn(256);
}

import { SWAP_TYPE } from 'bridge-core';
import { bnb, beldex } from '../core';
import addressValidator from 'wallet-address-validator';

export async function validateSwap(body) {
  if (!body) return 'invalid params';
  const { type, address } = body;

  if (!address) return 'address is required';
  if (!Object.values(SWAP_TYPE).includes(type)) return 'type is invalid';

  if (type === SWAP_TYPE.BBDX_TO_BDX) {
    // User should pass a BDX address
    const valid = await beldex.validateAddress(address);
    if (!valid) return 'address must be a BDX address';
  } else if (type === SWAP_TYPE.BDX_TO_BBDX) {
    // User should pass a BNB address
    // if (!bnb.validateAddress(address)) return 'address must be a BNB address';
    const valid = await addressValidator.validate(address, 'ETH');
    if (!valid) return 'address must be a BNB address';
  }

  return null;
}

export function validateUuidPresent(body) {
  if (!body) return 'invalid params';
  const { uuid } = body;
  if (!uuid) return 'uuid is required';
  return null;
}

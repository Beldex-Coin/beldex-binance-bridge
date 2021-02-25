import config from 'config';
import { TransactionHelper } from 'bridge-core';
import bnb from './binance';
import beldex from './beldex';
import { postgres, db, localDB } from './database';

const transactionHelper = new TransactionHelper({
  binance: {
    client: bnb,
    ourAddress: bnb.getAddressFromMnemonic(config.get('binance.mnemonic')),
  },
  beldex: { client: beldex },
});

export { bnb, beldex, postgres, db, transactionHelper, localDB };

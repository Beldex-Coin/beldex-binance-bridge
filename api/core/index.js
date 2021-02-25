import config from 'config';
import { TransactionHelper } from 'bridge-core';
import bnb from './binance';
import beldex from './beldex';
import { postgres, db } from './database';

const { depositAddress } = config.get('binance');

const transactionHelper = new TransactionHelper({
  binance: {
    client: bnb,
    ourAddress: depositAddress,
  },
  beldex: { client: beldex },
});

export { bnb, beldex, postgres, db, transactionHelper };

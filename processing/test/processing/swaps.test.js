/* eslint-disable no-restricted-syntax, no-await-in-loop */
import { assert } from 'chai';
import sinon from 'sinon';
import config from 'config';
import { SWAP_TYPE, TYPE } from 'bridge-core';
import { bnb, beldex, postgres, db } from '../../core';
import functions from '../../functions/swaps';
import { dbHelper } from '../helpers';
import log, { stubConsole } from '../../utils/log';

const processSwapFake = swaps => {
  const transactions = functions.getTransactions(swaps);
  if (!transactions || transactions.length === 0) {
    return null;
  }

  const totalAmount = transactions.reduce((total, current) => total + current.amount, 0);

  return {
    swaps,
    totalFee: 0,
    totalAmount,
  };
};

const sandbox = sinon.createSandbox();

describe('Processing Swaps', () => {
  beforeEach(() => {
    // Disable any logs
    sandbox.stub(log, 'console').value(stubConsole);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#getValidSwaps', () => {
    context('BDX TO BBDX', () => {
      it('should return the same array', () => {
        const swaps = [
          { amount: 100, address: '1' },
          { amount: 200, address: '2' },
          { amount: 300, address: '1' },
        ];

        const filtered = functions.getValidSwaps(swaps, SWAP_TYPE.BDX_TO_BBDX);
        assert.deepEqual(filtered, swaps);
      });
    });

    context('BBDX TO BDX', () => {
      const fee = 100;
      beforeEach(() => {
        sandbox.stub(functions, 'fees').value({
          [TYPE.BDX]: fee,
          [TYPE.BNB]: 0,
        });
      });

      it('should return the same array if all amounts are greater than the fee', () => {
        const swaps = [
          { amount: 100 + fee, address: '1' },
          { amount: 200 + fee, address: '2' },
          { amount: 300 + fee, address: '2' },
        ];

        const filtered = functions.getValidSwaps(swaps, SWAP_TYPE.BBDX_TO_BDX);
        assert.deepEqual(filtered, swaps);
      });

      it('should filter out any swaps where the amount is less than or equal to the fee', () => {
        const valid = { amount: 100 + fee, address: '2' };
        const swaps = [
          valid,
          { amount: 0.1, address: '1' },
          { amount: fee, address: '3' },
          { amount: 0, address: '4' },
        ];

        const filtered = functions.getValidSwaps(swaps, SWAP_TYPE.BBDX_TO_BDX);
        assert.deepEqual(filtered, [valid]);
      });

      it('should not filter out swaps if the TOTAL amount is more than the fees', () => {
        const swaps = [
          { amount: 0.1, address: '1' },
          { amount: fee, address: '1' },
        ];

        const filtered = functions.getValidSwaps(swaps, SWAP_TYPE.BBDX_TO_BDX);
        assert.deepEqual(filtered, swaps);
      });
    });
  });

  describe('#getTransactions', () => {
    it('should return an empty array if swaps is not an array', () => {
      const invalid = [0, null, {}, undefined, 'abc'];
      for (const val of invalid) {
        const transactions = functions.getTransactions(val);
        assert.lengthOf(transactions, 0);
      }

      const valid = [{ address: '1', amount: '10' }];
      const transactions = functions.getTransactions(valid);
      assert.lengthOf(transactions, 1);
    });

    it('should combine swap amounts', () => {
      const swaps = [
        { address: '1', amount: '10' },
        { address: '1', amount: 20 },
        { address: '2', amount: '15' },
      ];

      const transactions = functions.getTransactions(swaps);
      assert.deepEqual(transactions, [
        { address: '1', amount: 30 },
        { address: '2', amount: 15 },
      ]);
    });

    it('should be able to parse string amounts', () => {
      const transactions = functions.getTransactions([{ address: '1', amount: '12.3456789' }]);
      assert.deepEqual(transactions, [{ address: '1', amount: 12.3456789 }]);
    });

    it('should return a 0 amount if swap amount was not a number', () => {
      const transactions = functions.getTransactions([{ address: '1', amount: 'invalid amount' }]);
      assert.deepEqual(transactions, [{ address: '1', amount: 0 }]);
    });
  });

  describe('#send', () => {
    const transactions = [{ address: '1', amount: 7 * 1e9 }];

    let bnbStub;
    let beldexStub;

    beforeEach(() => {
      bnbStub = sandbox.stub(bnb, 'multiSend');
      beldexStub = sandbox.stub(beldex, 'multiSend');
    });

    it('should send to BNB if swap type is BDX_TO_BBDX', async () => {
      await functions.send(SWAP_TYPE.BDX_TO_BBDX, transactions);
      assert(bnbStub.called, 'bnb.multiSend was not called');
    });

    it('should send to BDX if swap type is BBDX_TO_BDX', async () => {
      await functions.send(SWAP_TYPE.BBDX_TO_BDX, transactions);
      assert(beldexStub.called, 'beldex.multiSend was not called');
    });

    it('should throw an error if swap type was invalid', async () => {
      try {
        await functions.send('invalid', transactions);
        assert.fail('Should have failed');
      } catch (e) {
        assert.strictEqual(e.message, 'Invalid swap type');
      }
    });

    it('should convert the transactions to correct outputs for BNB', async () => {
      await functions.send(SWAP_TYPE.BDX_TO_BBDX, transactions);

      const { args } = bnbStub.getCalls()[0];
      assert.lengthOf(args, 3);

      const outputs = args[1];
      assert.isNotNull(outputs);
      assert.deepEqual(outputs, [{
        to: transactions[0].address,
        coins: [{
          denom: 'TEST', // Defines in test.json
          amount: transactions[0].amount,
        }],
      }]);
    });

    it('should deduct the widthdrawal fee from each transaction for Beldex', async () => {
      const fee = process.env.WITHDRAWAL_FEE;

      await functions.send(SWAP_TYPE.BBDX_TO_BDX, transactions);

      const { args } = beldexStub.getCalls()[0];
      assert.lengthOf(args, 1);

      const outputs = args[0];
      assert.isNotNull(outputs);
      assert.deepEqual(outputs, [{
        address: transactions[0].address,
        amount: transactions[0].amount - (fee * 1e9),
      }]);
    });
  });

  describe('#processSwaps', () => {
    beforeEach(async () => {
      sandbox.stub(bnb, 'multiSend').resolves(['bnbTxHash1', 'bnbTxHash2']);
      sandbox.stub(beldex, 'multiSend').resolves(['beldexTxHash1', 'beldexTxHash2']);
      sandbox.stub(db, 'updateSwapsTransferTransactionHash').resolves();
    });

    it('should throw an error if swaps were empty', async () => {
      try {
        await functions.processSwaps([], SWAP_TYPE.BDX_TO_BBDX);
        assert.fail();
      } catch (e) {
        assert.instanceOf(e, functions.Errors.NoSwapsToProcess);
      }
    });

    it('should return the correct data if it succeeds', async () => {
      const fee = 20;
      sandbox.stub(functions, 'fees').value({
        [TYPE.BDX]: fee,
        [TYPE.BNB]: 0,
      });

      const values = {
        a: [100, 200],
        b: [150],
      };

      const swaps = Object.keys(values).flatMap((address, i) => {
        const amounts = values[address];
        return amounts.map(amount => ({ uuid: i, amount, address }));
      });

      const total = Object.values(values).flat().reduce((acc, v) => acc + v, 0);

      // Fee should only be charged once per address
      const expectedFees = fee * Object.keys(values).length;

      // Make sure we get the BDX fees
      const data = await functions.processSwaps(swaps, SWAP_TYPE.BBDX_TO_BDX);
      assert.isNotNull(data);
      assert.deepEqual(data, {
        swaps,
        totalAmount: total - expectedFees,
        totalFee: expectedFees,
      });
    });

    context('BBDX TO BDX', () => {
      it('should not return swaps which are invalid', async () => {
        const fee = 20;
        sandbox.stub(functions, 'fees').value({
          [TYPE.BDX]: fee,
          [TYPE.BNB]: 0,
        });

        const values = {
          a: [100, 200],
          b: [150],
          c: [0.1, 0.3],
        };

        const swaps = Object.keys(values).flatMap((address, i) => {
          const amounts = values[address];
          return amounts.map(amount => ({ uuid: i, amount, address }));
        });

        // Make sure we get the BDX fees
        const data = await functions.processSwaps(swaps, SWAP_TYPE.BBDX_TO_BDX);
        assert.isNotNull(data);
        assert.deepEqual(data.swaps, swaps.filter(v => v.address !== 'c'));
      });
    });
  });

  describe('#processAutoSwaps', () => {
    const usdPrice = 0.5;
    beforeEach(async () => {
      sandbox.stub(functions, 'getCurrentBeldexPriceInUSD').resolves(usdPrice);
      sandbox.stub(functions, 'processSwaps').callsFake(processSwapFake);
    });

    it('should throw an error if usd price is null', async () => {
      sandbox.restore();
      sandbox.stub(functions, 'getCurrentBeldexPriceInUSD').resolves(null);

      try {
        await functions.processAutoSwaps(10, 100, SWAP_TYPE.BDX_TO_BBDX);
        assert.fail();
      } catch (e) {
        assert.instanceOf(e, functions.Errors.PriceFetchFailed);
      }
    });

    it('should throw an error if usd price was less than 0', async () => {
      sandbox.restore();
      sandbox.stub(functions, 'getCurrentBeldexPriceInUSD').resolves(-1);

      try {
        await functions.processAutoSwaps(10, 100, SWAP_TYPE.BBDX_TO_BDX);
        assert.fail();
      } catch (e) {
        assert.instanceOf(e, functions.Errors.PriceFetchFailed);
      }
    });

    it('should throw an error if no swaps were processed', async () => {
      sandbox.stub(db, 'getPendingSwaps').resolves([]);

      try {
        await functions.processAutoSwaps(10, 100, SWAP_TYPE.BBDX_TO_BDX);
        assert.fail();
      } catch (e) {
        assert.instanceOf(e, functions.Errors.NoSwapsToProcess);
      }
    });

    it('should throw an error if daily amount is greater or equal to the limit', async () => {
      sandbox.stub(db, 'getPendingSwaps').resolves([{ uuid: 1, amount: 100, address: 'a' }]);

      const pairs = [[100, 100], [101, 100]];
      for (const [amount, limit] of pairs) {
        try {
          await functions.processAutoSwaps(amount, limit, SWAP_TYPE.BBDX_TO_BDX);
          assert.fail();
        } catch (e) {
          assert.instanceOf(e, functions.Errors.DailyLimitHit);
        }
      }
    });

    it('should not throw an error if daily amount is less than the limit', async () => {
      sandbox.stub(db, 'getPendingSwaps').resolves([{ uuid: 1, amount: 100, address: 'a' }]);

      try {
        await functions.processAutoSwaps(10, 100, SWAP_TYPE.BBDX_TO_BDX);
      } catch (e) {
        console.log(e);
        assert.fail();
      }
    });

    it('should process all transactions if daily limit has not been hit', async () => {
      const swaps = ['a', 'b', 'c'].map((a, i) => ({ uuid: i, amount: (i + 1) * 1e9, address: a }));
      sandbox.stub(db, 'getPendingSwaps').resolves(swaps);

      const data = await functions.processAutoSwaps(0, 99 * 1e9, SWAP_TYPE.BDX_TO_BBDX);
      assert.deepEqual(data.swaps, swaps);
    });

    it('should only process transactions up to the daily limit', async () => {
      const amounts = [1e9, 2e9, 3e9, 5.7e9];
      const swaps = ['a', 'b', 'c'].map((a, i) => ({ uuid: i, amount: amounts[i], address: a }));
      sandbox.stub(db, 'getPendingSwaps').resolves(swaps);

      // This will target amounts[0] and amounts[1]
      const max = amounts[0] + amounts[1];
      const maxUSD = (max / 1e9) * usdPrice;

      const data = await functions.processAutoSwaps(0, maxUSD, SWAP_TYPE.BDX_TO_BBDX);
      assert.deepEqual(data.swaps, swaps.slice(0, 2));
    });

    it('should be allowed to process 1 swap above the daily limit', async () => {
      const amounts = [1e9, 2e9, 3e9];
      const swaps = ['a', 'b', 'c'].map((a, i) => ({ uuid: i, amount: amounts[i], address: a }));
      sandbox.stub(db, 'getPendingSwaps').resolves(swaps);

      // This should still allow amount[1] to be processed
      const max = amounts[0] + (0.1 * 1e9);
      const maxUSD = (max / 1e9) * usdPrice;

      const data = await functions.processAutoSwaps(0, maxUSD, SWAP_TYPE.BDX_TO_BBDX);
      assert.deepEqual(data.swaps, swaps.slice(0, 2));
    });

    it('should properly process swaps with the same addresses', async () => {
      const amounts = [1e9, 2e9, 3e9];
      const swaps = ['a', 'a', 'a'].map((a, i) => ({ uuid: i, amount: amounts[i], address: a }));
      sandbox.stub(db, 'getPendingSwaps').resolves(swaps);

      const data = await functions.processAutoSwaps(0, 99 * 1e9, SWAP_TYPE.BDX_TO_BBDX);
      assert.deepEqual(data.swaps, swaps);
    });

    it('should return the correct data', async () => {
      const amounts = [1.5e9, 2.32e9, 3.68e9];
      const swaps = ['a', 'b', 'c'].map((a, i) => ({ uuid: i, amount: amounts[i], address: a }));
      sandbox.stub(db, 'getPendingSwaps').resolves(swaps);
      sandbox.stub(functions, 'fees').value({
        [TYPE.BDX]: 0,
        [TYPE.BNB]: 0,
      });

      const data = await functions.processAutoSwaps(0, 99 * 1e9, SWAP_TYPE.BDX_TO_BBDX);

      const sum = (a, b) => a + b;
      const total = amounts.reduce(sum, 0);

      // The sum of the usd is the sum of (amount (in decimal) * usd price)
      const usdSum = amounts.map(a => (a / 1e9) * usdPrice).reduce(sum, 0);

      assert.deepEqual(data, {
        swaps,
        totalAmount: total,
        totalFee: 0,
        totalUSD: usdSum,
      });
    });
  });

  describe('#processAllSwapsOfType', () => {
    beforeEach(async () => {
      // Clear out any data in the db
      await postgres.none('TRUNCATE client_accounts, accounts_bdx, accounts_bnb, swaps CASCADE;');

      sandbox.stub(bnb, 'multiSend').resolves(['bnbTxHash1', 'bnbTxHash2']);
      sandbox.stub(beldex, 'multiSend').resolves(['beldexTxHash1', 'beldexTxHash2']);
    });

    const processAllSwapsOfType = async swapType => {
      const addressType = swapType === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;
      const accountType = addressType === TYPE.BNB ? TYPE.BDX : TYPE.BNB;
      const clientAccountUuid = 'cbfa4d0f-cecb-4c46-88b8-719bbca6395a';
      const swapUuid = 'a2a67748-ae5d-415c-81d6-803d28dc29fb';

      await postgres.tx(t => t.batch([
        dbHelper.insertClientAccount(clientAccountUuid, 'address', addressType, 'uuid', accountType),
        dbHelper.insertSwap(swapUuid, swapType, 10 * 1e9, clientAccountUuid, 'pending'),
      ]));

      await functions.processAllSwapsOfType(swapType);

      return postgres.oneOrNone('select transfer_transaction_hash from swaps where uuid = $1', [swapUuid]);
    };

    context('BDX_TO_BBDX', () => {
      it('should update the transfer transactions hash on success', async () => {
        const swap = await processAllSwapsOfType(SWAP_TYPE.BDX_TO_BBDX);
        assert.isNotNull(swap);
        assert.strictEqual(swap.transfer_transaction_hash, 'bnbTxHash1,bnbTxHash2');
      });
    });

    context('BBDX_TO_BDX', () => {
      it('should update the transfer transactions hash on success', async () => {
        const swap = await processAllSwapsOfType(SWAP_TYPE.BBDX_TO_BDX);
        assert.isNotNull(swap);
        assert.strictEqual(swap.transfer_transaction_hash, 'beldexTxHash1,beldexTxHash2');
      });
    });
  });
});

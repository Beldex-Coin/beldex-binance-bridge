/* eslint-disable no-else-return, no-restricted-syntax, no-await-in-loop */
import axios from 'axios';
import config from 'config';
import chalk from 'chalk';
import Decimal from 'decimal.js';
import { SWAP_TYPE, TYPE } from 'bridge-core';
import { db, bnb, beldex } from '../core';
import log from '../utils/log';
import Web3 from 'web3';
import Tx from 'ethereumjs-tx';

// The fees in decimal format
const configFees = { [TYPE.BDX]: process.env.WITHDRAWAL_FEE };

const symbols = {
  [TYPE.BDX]: 'BDX',
  [TYPE.BNB]: 'wBDX',
};

class PriceFetchFailed extends Error { }
class NoSwapsToProcess extends Error { }
class DailyLimitHit extends Error { }

const module = {
  // The fees in 1e9 format
  fees: { [TYPE.BDX]: (parseFloat(configFees[TYPE.BDX]) * 1e9).toFixed(0) },

  Errors: { PriceFetchFailed, NoSwapsToProcess, DailyLimitHit },
  /**
  * Process all pending swaps and send out the coins.
  */
  async processAllSwaps() {
    try {
      for (const swapType of Object.values(SWAP_TYPE)) {
        log.header(chalk.blue(`Processing swaps for ${swapType}`));
        const info = await module.processAllSwapsOfType(swapType);
        module.printInfo(info, swapType);
      }
    } catch (e) {
      log.error(chalk.red(`Error: ${e.message}`));
    }
  },

  /**
  * Print out info to the console
  */
  printInfo(info, swapType) {
    if (!info) {
      log.info(chalk.yellow('No swaps found'));
      return;
    }

    const { swaps, totalAmount } = info;
    const sentCurrency = swapType === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;

    log.info(chalk`{green Completed {white.bold ${swaps.length}} swaps}`);
    log.info(chalk`{green Amount sent:} {bold ${totalAmount}} {yellow ${symbols[sentCurrency]}}`);
  },

  /**
   * Process all pending swaps and send out the coins.
   *
   * @param {string} swapType The type of swap.
   * @returns {{ swaps, totalAmount, totalFee }} The completed swap info.
   */
  async processAllSwapsOfType(swapType) {
    const swaps = await db.getPendingSwaps(swapType);
    try {
      const data = await module.processSwaps(swaps, swapType);
      return data;
    } catch (e) {
      if (e instanceof NoSwapsToProcess) return null;
      throw e;
    }
  },

  /**
   * Perform auto swap on the given type.
   *
   * @param {number|string} dailyAmount The curreny daily amount swapped in usd.
   * @param {number|string} dailyLimit The maximum daily amount to swap in usd.
   * @param {string} swapType The type of swap.
   */
  async processAutoSwaps(dailyAmount, dailyLimit, swapType) {
    // Get the usd price of BDX and make sure it is valid
    const usdPrice = await module.getCurrentBeldexPriceInUSD();
    if (!usdPrice || usdPrice < 0) throw new PriceFetchFailed();

    // Get our pending swaps and their transactions
    const pendingSwaps = await db.getPendingSwaps(swapType);

    // Sort by lowest first
    const pendingTransactions = module.getTransactions(pendingSwaps).sort((a, b) => a.amount - b.amount);

    // Return early if we have no swaps to process
    if (pendingTransactions.length === 0) throw new NoSwapsToProcess();

    // We want to avoid weird JS decimal roundings, so we use a dedicated library (0.6 * 3 will be 1.7999999999999998 in JS)
    let currentAmount = new Decimal(dailyAmount);
    let total = new Decimal(0);

    // Make sure we let user know of daily limit hit
    if (currentAmount.greaterThanOrEqualTo(dailyLimit)) throw new DailyLimitHit();

    // Go through all transactions and use greedy algorithm to fill out our dailyAmount
    const transactions = [];
    while (pendingTransactions.length > 0 && currentAmount.lessThan(dailyLimit)) {
      const tx = pendingTransactions.shift();

      const decimalAmount = new Decimal(tx.amount).dividedBy(1e9);
      const usdAmount = decimalAmount.mul(usdPrice);

      // Add the transaction straight away since we only want to stop when our currentAmount goes over the dailyLimit
      transactions.push(tx);
      currentAmount = currentAmount.add(usdAmount);
      total = total.add(usdAmount);
    }

    // We need to map transaction back to swaps
    const swaps = transactions.flatMap(t => pendingSwaps.filter(s => s.address === t.address));

    // Process these swaps
    const info = await module.processSwaps(swaps, swapType);

    // Return the total value in usd
    return {
      ...info,
      totalUSD: total.toNumber(),
    };
  },

  /**
   * Get the current price of BDX
   */
  async getCurrentBeldexPriceInUSD() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=beldex&vs_currencies=usd');
      return response.data['beldex'].usd;
    } catch (e) {
      log.debug(e);
      throw new PriceFetchFailed();
    }
  },

  /**
   * Process the given swaps and send out the coins
   * @param {[{ uuid, amount, address }]} swaps The swaps.
   * @param {string} swapType The swap type.
   * @returns {{ swaps, totalAmount, totalFee }} The completed swap info.
   */
  async processSwaps(swaps, swapType) {
    const validSwaps = module.getValidSwaps(swaps, swapType);
    const ids = validSwaps.map(s => s.uuid);
    const transactions = module.getTransactions(validSwaps);
    if (!transactions || transactions.length === 0) throw new NoSwapsToProcess();

    const txHashes = await module.send(swapType, transactions);
    for (let i = 0; i < txHashes.length; i++) {
      await db.updateSwapsTransferTransactionHash(txHashes[i].uuid,txHashes[i].tx);
    }

    const sentCurrency = swapType === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;

    // This is in 1e9 format
    const transactionAmount = transactions.reduce((total, current) => total + current.amount, 0);
    // Fee is per transaction (1 transaction = 1 user)
    const totalFee = parseFloat(process.env.WITHDRAWAL_FEE);
    const totalAmount = transactionAmount / 1e9 - totalFee;

    return {
      swaps: validSwaps,
      totalAmount,
      totalFee,
    };
  },

  /**
   * Get all the swaps which are not invalid.
   *
   * For BBDX_TO_BDX, a swap is invalid if:
   *  The total amount from an address is less than the fee
   *
   * @param {[{ uuid, amount, address }]} swaps The swaps
   * @param {string} swapType The swap type
   * @returns The valid swaps.
   */
  getValidSwaps(swaps, swapType) {
    if (swapType !== SWAP_TYPE.BBDX_TO_BDX) return swaps;

    // If it's BBDX_TO_BDX we need to sum up the swaps values and check that they're greater than the bdx fee
    const transactions = module.getTransactions(swaps);

    // A transaction is invalid if the amount - fee is negative
    const invalidTransactions = transactions.filter(({ amount }) => {
      const fee = module.fees[TYPE.BDX] || 0;
      return (amount - fee) <= 0;
    });

    // Get the swaps which don't have the invalid transaction addresses
    const invalidAddresses = invalidTransactions.map(t => t.address);
    return swaps.filter(s => !invalidAddresses.includes(s.address));
  },

  /**
   * Take an array of `swaps` and combine the ones going to the same `address`.
   *
   * @param {[{ amount, address: string }]} swaps An array of swaps.
   * @returns Simplified transactions from the swaps.
   */
  getTransactions(swaps) {
    if (!Array.isArray(swaps)) return [];
    let data = []
    // eslint-disable-next-line no-restricted-syntax
    for (const swap of swaps) {
        data.push({
          address: swap.address,
          amount: parseFloat(swap.amount) || 0,
          uuid: swap.uuid
        })
    }
    return data;
  },

  /**
   * Send the given `swaps`.
   *
   * @param {string} swapType The type of swap.
   * @param {[{ address: string, amount: number }]} transactions An array of transactions.
   * @returns An array of transaction hashes
   */
  async send(swapType, transactions) {
    // Multi-send always returns an array of hashes
    if (swapType === SWAP_TYPE.BDX_TO_BBDX) {
      // const symbol = config.get('binance.symbol');
      // const outputs = transactions.map(({ address, amount }) => ({
      //   to: address,
      //   coins: [{
      //     denom: symbol,
      //     amount,
      //   }],
      // }));
      let response = [];
      for (let index = 0; index < transactions.length; index++) {
        let totalAmount = parseFloat((transactions[index].amount / 1e9).toString());
        let transactionFee = parseFloat(process.env.WITHDRAWAL_FEE);
        let feeTaken = (totalAmount - transactionFee).toFixed(2);
        if (feeTaken > 0) {
          let finalAmount = (feeTaken * 1e9).toString();
          let responseTransactionDetails = await module.sendToBsc(transactions[index].address, finalAmount, transactions[index]);
          response.push(responseTransactionDetails);
        }
      }
      return response;
      // Send BNB to the users
      // await module.sendToBsc(address);
      // return bnb.multiSend(config.get('binance.mnemonic'), outputs, 'Beldex Bridge');
    } else if (swapType === SWAP_TYPE.BBDX_TO_BDX) {
      // Deduct the Beldex withdrawal fees.
      const outputs = transactions.map(({ address, amount }) => {
        const fee = module.fees[TYPE.BDX] || 0;
        return {
          address,
          amount: Math.max(0, amount - fee),
        };
      });
      // Send Beldex to the users
      return beldex.multiSend(outputs);
    }

    throw new Error('Invalid swap type');
  },
  async sendToBsc(toAddress, transferAmount, transactionDetails) {
    //toAddress -> where to send it
    // Fee is per transaction (1 transaction = 1 user))
    const bscUrl = process.env.BSCURL;
    const Web3js = await new Web3(await new Web3.providers.HttpProvider(bscUrl));
    const contractAddr = process.env.CONTRACT_ADDR;
    const fromAddress = process.env.FROM_ADDRESS;
    const prvtKey = process.env.SIGNATURE;
    let privateKey = Buffer.from(prvtKey, 'hex');
    let contractABI = [{ "constant": true, "inputs": [], "name": "mintingFinished", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_token", "type": "address" }], "name": "reclaimToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }, { "name": "_note", "type": "string" }], "name": "burnWithNote", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "unpause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "claimOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "paused", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "finishMinting", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "pendingOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }, { "indexed": false, "name": "note", "type": "string" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintFinished", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }], "name": "OwnershipRenounced", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];
    let contract = await new Web3js.eth.Contract(contractABI, contractAddr, { from: fromAddress });
    //   // 1e18 === 1 HST
    let amountChangeFormat = await Web3js.utils.toHex(transferAmount);
    let checkCount = await Web3js.eth.getTransactionCount(fromAddress);
    let nonce = await Web3js.utils.toHex(checkCount);
    let rawTransaction = {
      'from': fromAddress,
      'gasPrice': await Web3js.utils.toHex(20 * 1e9),
      'gasLimit': await Web3js.utils.toHex(210000),
      'to': contractAddr,
      'value': 0x0,
      'data': contract.methods.transfer(toAddress + '', amountChangeFormat).encodeABI(),
      'nonce': nonce
    };
    // let transaction = new Tx(rawTransaction)
    let transaction = await new Tx(rawTransaction);
    transaction.sign(privateKey);
    // var serializedTx = tx.serialize();
    let transactionResponse = await Web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    return { tx: transactionResponse.logs[0].transactionHash, uuid: transactionDetails.uuid };
  }

};


export default module;

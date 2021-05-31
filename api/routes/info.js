/* eslint-disable import/prefer-default-export */
import config from 'config';
import clients from '../../processing/core/binance';
import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

export function getInfo(req, res, next) {
  const beldexFee = process.env.WITHDRAWAL_FEE;
  const beldexAmount = (parseFloat(beldexFee) * 1e9).toFixed(0);

  const info = { fees: { bdx: beldexAmount } };

  res.status(205);
  res.body = {
    status: 200,
    success: true,
    result: info,
  };
  return next(null, req, res, next);
}

export async function getBalance(req, res, next) {
  const bscUrl = process.env.BSCURL;
  const Web3js = await new Web3(await new Web3.providers.HttpProvider(bscUrl));
  const contractAddr = process.env.CONTRACT_ADDR;
  let minABI = [
    // balanceOf
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "type": "function"
    },
    // decimals
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "name": "", "type": "uint8" }],
      "type": "function"
    }
  ];
  const walletAddress = process.env.FROM_ADDRESS;
  let contract = new Web3js.eth.Contract(minABI, contractAddr);
  let tokenBalance;
  await contract.methods.balanceOf(walletAddress)
    .call().then((balance) => {
      tokenBalance = (balance / 1e9);
    });
  const totalBbdxSupply = process.env.TOTAL_SUPPLY;
  let beldexBalance = [{
    totalSupply: totalBbdxSupply,
    movedBalance: totalBbdxSupply - Number(tokenBalance)
  }];
  res.status(205);
  res.body = {
    status: 200,
    success: true,
    result: beldexBalance
  };
  return next(null, req, res, next);
}
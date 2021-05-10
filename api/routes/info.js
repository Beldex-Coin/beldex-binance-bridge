/* eslint-disable import/prefer-default-export */
import config from 'config';
import clients from '../../processing/core/binance';
import Web3 from 'web3';

export function getInfo(req, res, next) {
  const beldexFee = config.get('beldex.withdrawalFee');
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
  const bscUrl = config.get('bsc.url');
  const Web3js = await new Web3(await new Web3.providers.HttpProvider(bscUrl));
  let balance = await new Web3js.eth.getBalance('0xdFc515De6EA5eE5502FF1Bdd5b5Bded2C41140Fb');
  console.log("balance :",(balance/1e9)/1e9,balance)
  const binanceAddress = config.get('binance.depositAddress');
  const clien = clients.getClient();
  const getBalance = await clien.getBalance('0xdFc515De6EA5eE5502FF1Bdd5b5Bded2C41140Fb');
  console.log("et:",getBalance)
  // const totalBbdxSupply = config.get('binance.totalSupply');
  let beldexBalance = getBalance.filter(data => data.symbol === config.get('binance.symbol'));
  beldexBalance[0].totalSupply = totalBbdxSupply;
  beldexBalance[0].movedBalance = totalBbdxSupply - Number(beldexBalance[0].free);
  res.status(205);
  res.body = {
    status: 200,
    success: true,
    result: beldexBalance
  };
  return next(null, req, res, next);
}
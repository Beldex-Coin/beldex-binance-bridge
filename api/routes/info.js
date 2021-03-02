/* eslint-disable import/prefer-default-export */
import config from 'config';
import clients from '../../processing/core/binance';

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
  const binanceAddress = config.get('binance.depositAddress');
  const clien = clients.getClient();
  const getBalance = await clien.getBalance(binanceAddress);
  const totalBbdxSupply = config.get('binance.totalSupply');
  let beldexBalance = getBalance.filter(data => data.symbol === config.get('binance.symbol'));
  beldexBalance[0].totalSupply = totalBbdxSupply;
  res.status(205);
  res.body = {
    status: 200,
    success: true,
    result: beldexBalance
  };
  return next(null, req, res, next);
}
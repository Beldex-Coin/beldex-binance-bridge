/* eslint-disable import/prefer-default-export */
import config from 'config';

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

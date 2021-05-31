import config from 'config';
import { clients } from 'bridge-core';
import dotenv from 'dotenv';
dotenv.config();

// const { filename, password, accountIndex } = config.get('beldex.wallet');
// const { host, port, username, password } = config.get('beldex.walletRPC');

// const rpc = {
//   hostname: process.env.BELDEX_WALLETRPC_HOST,
//   port,
//   username,
//   password,
// };
const rpc = {
  hostname: process.env.BELDEX_WALLETRPC_HOST,
  port: process.env.BELDEX_WALLETRPC_PORT,
  username: process.env.BELDEX_WALLETRPC_USERNAME,
  password: process.env.BELDEX_WALLETRPC_PASSWORD,
};

// const wallet = {
//   filename,
//   password,
//   accountIndex,
// };
// const wallet = {
  // filename: process.env.BELDEX_WALLET_FILENAME,
  // password: process.env.BELDEX_WALLET_PASSWORD,
  // accountIndex: Number(process.env.BELDEX_WALLET_ACCOUNTINDEX),
// };

export default new clients.beldexClient(rpc);

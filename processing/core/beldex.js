import config from 'config';
import { clients } from 'bridge-core';
import dotenv from 'dotenv';
dotenv.config();

// const { host, port, username, password } = config.get('beldex.walletRPC');
// export default new clients.beldexClient({
//   hostname: host,
//   port,
//   username,
//   password,
// });

export default new clients.beldexClient({
  hostname: process.env.BELDEX_WALLETRPC_HOST,
  port:process.env.BELDEX_WALLETRPC_PORT,
  username:process.env.BELDEX_WALLETRPC_USERNAME,
  password:process.env.BELDEX_WALLETRPC_PASSWORD
});



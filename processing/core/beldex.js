import config from 'config';
import { clients } from 'bridge-core';

const { host, port, username, password } = config.get('beldex.walletRPC');

export default new clients.beldexClient({
  hostname: host,
  port,
  username,
  password,
});

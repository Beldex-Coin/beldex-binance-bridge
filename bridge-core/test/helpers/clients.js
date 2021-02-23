import { PostgresClient, LokiClient, BinanceClient } from '../../clients';

export const loki = new LokiClient({
  hostname: 'localhost',
  port: 18083,
  username: 'test',
  password: 'test',
},
{
  filename: 'test',
  password: 'test',
});

export const bnb = new BinanceClient({
  api: 'https://testnet-dex.binance.org/',
  network: 'testnet',
  symbol: 'BDX',
});

export const postgres = PostgresClient({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
});

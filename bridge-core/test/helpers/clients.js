import { PostgresClient, beldexClient, BinanceClient } from '../../clients';
import dotenv from 'dotenv';
dotenv.config();

// export const beldex = new beldexClient({
//   hostname: 'localhost',
//   port: 18083,
//   username: 'test',
//   password: 'test',
// },
//   {
//     filename: 'test',
//     password: 'test',
//   });

export const beldex = new beldexClient({
  hostname: process.env.BELDEX_WALLETRPC_HOST,
  port: process.env.BELDEX_WALLETRPC_PORT,
  username: process.env.BELDEX_WALLETRPC_USERNAME,
  password: process.env.BELDEX_WALLETRPC_PASSWORD,
}, {
  filename: process.env.BELDEX_WALLET_FILENAME,
  password: process.env.BELDEX_WALLET_PASSWORD,
});

export const bnb = new BinanceClient({
  api: 'https://testnet-dex.binance.org/',
  network: 'testnet',
  symbol: 'BDX-7BA',
});

// export const postgres = PostgresClient({
//   host: 'localhost',
//   port: 5432,
//   database: "postgres",
//   user: "postgres",
//   password: "postgres"
// });

export const postgres = PostgresClient({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});
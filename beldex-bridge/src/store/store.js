import axios from "axios";
import { EventEmitter } from "events";
import { encrypt } from "@utils/crypto";
import { Warning } from "@utils/error";
import config from "@config";
import * as Actions from "./actions";
import * as Events from "./events";
import dispatcher from "./dispatcher";

const { useAPIEncryption } = config;

const httpClient = axios.create({ baseURL: process.env.REACT_APP_APIURL });
const endpoints = {
  getInfo: "/api/v1/getInfo",
  getUncomfirmedBeldexTransactions: "/api/v1/getUncomfirmedBeldexTransactions",
  getSwaps: "/api/v1/getSwaps",
  swap: "/api/v1/swap",
  finalizeSwap: "/api/v1/finalizeSwap",
  createBNBAccount: "/api/v1/createBNBAccount",
  downloadBNBKeystore: "/api/v1/downloadBNBKeystore",
  getBalance: "/api/v1/getBalance",
  sendTransaction: "/api/v1/transfer",
  errorLog: "/api/v1/log",
};

class Store extends EventEmitter {
  constructor() {
    super();
    this.store = {};

    dispatcher.register(async (payload) => {
      console.log("wallet Address::1", payload.type);
      switch (payload.type) {
        case Actions.GET_INFO:
          this.getInfo();
          break;
        case Actions.GET_UNCONFIRMED_BELDEX_TXS:
          this.getUnconfirmedBeldexTransactions(payload);
          break;
        case Actions.GET_SWAPS:
          this.getSwaps(payload);
          break;
        case Actions.SWAP_TOKEN:
          this.swapToken(payload);
          break;
        case Actions.FINALIZE_SWAP_TOKEN:
          this.finalizeSwap(payload);
          break;
        case Actions.GET_BALANCE:
          this.getBalance();
          break;
        case Actions.SEND_TRANSACTION_HASH:
          this.sendTransactionHash(payload);
          break;
        case Actions.SEND_TRANSACTION_ERROR_LOG:
          this.sendTransactionErrLog(payload);
          break;
        case Actions.CONNECTED_WALLET_INFO:
          console.log("wallet Address::3", payload.type);

          this.setWalletAddress(payload);
          break;
        case Actions.POPUP_OPEN:
          // console.log("wallet Address::3", payload.type);

          this.setPopupOpen(payload);
          break;
        default:
          break;
      }
    });
    console.log("this.store ", this.store);
  }

  getStore(key) {
    return this.store[key];
  }

  async sendTransactionHash(payload) {
    try {
      const data = await this.fetch(
        endpoints.sendTransaction,
        "POST",
        payload.content
      );
      this.store.info = data.result;
      this.emit(Events.TRANSACTION_INFO, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async sendTransactionErrLog(payload) {
    try {
      const data = await this.fetch(
        endpoints.errorLog,
        "POST",
        payload.content
      );
      this.store.error = data.result;
      // this.emit(Events.TRANSACTION_INFO, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async getInfo() {
    try {
      const data = await this.fetch(endpoints.getInfo, "GET");
      this.store.info = data.result;
      this.emit(Events.FETCHED_INFO, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async getUnconfirmedBeldexTransactions(payload) {
    try {
      const data = await this.fetch(
        endpoints.getUncomfirmedBeldexTransactions,
        "GET",
        payload.content
      );
      this.emit(Events.FETCHED_UNCONFIRMED_BELDEX_TXS, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async getSwaps(payload) {
    try {
      const data = await this.fetch(endpoints.getSwaps, "GET", payload.content);
      this.emit(Events.FETCHED_SWAPS, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async swapToken(payload) {
    try {
      const data = await this.fetch(endpoints.swap, "POST", payload.content);
      this.emit(Events.TOKEN_SWAPPED, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async finalizeSwap(payload) {
    try {
      const data = await this.fetch(
        endpoints.finalizeSwap,
        "POST",
        payload.content
      );
      this.emit(Events.TOKEN_SWAP_FINALIZED, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  async fetch(url, method, params = null) {
    // Encrypt the params if necessary
    let encrypted = params;
    if (useAPIEncryption && method.toLowerCase() === "post") {
      encrypted = encrypt(params, url);
    }

    const field = method.toLowerCase() === "post" ? "data" : "params";
    try {
      const { data } = await httpClient({
        method,
        url,
        [field]: encrypted,
      });

      if (data.status === 200 && !data.success) {
        throw new Warning(data.result);
      }

      return data;
    } catch (e) {
      // console.log(`Failed fetch ${url}: `, e);

      // If we got an error from the api then throw it
      if (e.response && e.response.data) {
        throw new Error(e.response.data.result);
      }

      // Some other error occurred
      throw e;
    }
  }

  async getBalance() {
    try {
      const data = await this.fetch(endpoints.getBalance, "GET");
      this.store.balance = data.result;
      this.emit(Events.FETCHED_BALANCE, data.result);
    } catch (e) {
      this.emit(Events.ERROR, e);
    }
  }

  
  async setWalletAddress(payload) {
    console.log("wallet Address::3", payload.type);

    try {
      // const data = await this.fetch(endpoints.getSwaps, "GET", payload.content);
      this.store.connectedWalletInfo = payload.content;
      this.emit(Events.CONNECTED_WALLET_INFO, payload.content);
      console.log("get balance ::", payload.content);
    } catch (e) {
      this.emit(Events.ERROR, e);
      console.log("get balance error::", e);
    }
  }
  async setPopupOpen(payload) {
    console.log("wallet Address::3", payload.type);

    try {
      // const data = await this.fetch(endpoints.getSwaps, "GET", payload.content);
      this.store.popupOpen = payload.content;
      this.emit(Events.POPUP_OPEN, payload.content);
      // console.log("get balance ::", payload.content);
    } catch (e) {
      this.emit(Events.ERROR, e);
      // console.log("get balance error::", e);
    }
  }
}

export default new Store();

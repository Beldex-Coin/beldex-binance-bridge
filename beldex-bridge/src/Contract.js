import React from 'react';
import Web3 from 'web3';
import matrixAbi from './matrixAbi';


const MATRIX_ADDRESS = '0xd514398Ba7ce5fE4827af193CdaB3c781E3055f0';


class Contract extends React.Component {
  getAddress = (callback, err) => {
    if (!window.ethereum && !window.web3) {
      callback('', false);
      return false;
    }
    if (!window.web3.eth.coinbase) {
      if (window.ethereum) {
        if (window.ethereum.autoRefreshOnNetworkChange) {
          window.ethereum.autoRefreshOnNetworkChange = false;
        }
        const web3Obj = new Web3(window.ethereum);
        try {
          window.ethereum.enable();
          if (web3Obj) {
            let address = setInterval(() => {
              web3Obj.eth.getCoinbase((err, res) => {
                if (res) {
                  clearInterval(address);
                  callback(web3Obj, true);
                }
              });
            }, 500);
          }
        } catch (error) {
          return false;
        }
      }
    }
  }

  getWeb3 = (callback, err) => {
    if (!window.ethereum && !window.web3) {
      return false;
    }
    let i = 0;
    let id = setInterval(() => {
      if (i > 1800 || window.web3.eth.coinbase) {
        clearInterval(id);
        if (window.web3.eth.coinbase) {
          this.startApp();
          callback(window.web3, true);
        }
      } else if (++i === 1) {
        if (window.ethereum) {
          if (window.ethereum.autoRefreshOnNetworkChange) {
            window.ethereum.autoRefreshOnNetworkChange = false;
          }
          window.web3 = new Web3(window.ethereum);
          try {
            window.ethereum.enable();
            this.startApp();
          } catch (error) {
            return false;
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
          this.startApp();
        }
      }
    }, 100);
  }

  startApp = () => {
    this.MatrixContract = window.web3.eth.contract(matrixAbi);
    this.MatrixInstance = this.MatrixContract.at(MATRIX_ADDRESS);
    this.contractAddress = MATRIX_ADDRESS;
    this.initData();
  }

  initData = () => {
    document.body.classList.add('web3' in window ? 'web3' : 'noweb3');
  }

  signMessage = (message) => {
    return new Promise((ok, fail) => {
      this.getWeb3((web3) => {
        web3.personal.sign(web3.fromUtf8(message), web3.eth.coinbase, (error, sign) => {
          if (error) {
            fail(error)
          } else {
            ok(sign)
          }
        });
      });
    });
  }


  rememberSession = (userAddress, sessionCallback) => {
    let hash = 'chrome' || 'unknown';
    this.signMessage(hash).then((sign) => {
      const abc = {
        userAddress: userAddress,
        sign: sign,
        hash: hash
      };
      sessionCallback(abc);
    });
  }
  signIn = (cb) => {
    this.getWeb3((web3) => {
      this.MatrixInstance.isUserExists(web3.eth.coinbase, (err, isUserExists) => {
        if (err) {
          cb(err);
          return false;
        }
        if (!isUserExists) {
          cb(isUserExists, web3.eth.coinbase);
          // return false;
        }
        this.rememberSession(web3.eth.coinbase, (response, err) => {
          cb(response, web3.eth.coinbase);
          return true;
        });
      });
    });
    return false;
  }

}

export default Contract;
import React, { Component } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Box, Link } from "@material-ui/core";
import { Warning } from "@utils/error";
import { store, dispatcher, Actions, Events } from "@store";
import { SWAP_TYPE, TYPE } from "@constants";
import { SwapSelection, SwapInfo, SwapList, Popup } from "@components";
import styles from "./styles";
import matrixAbi from "../../matrixAbi";
import Back from "./back.svg";

const currencySymbols = {
  [TYPE.BDX]: "BDX",
  [TYPE.BNB]: "wBDX",
};
class Swap extends Component {
  state = {
    loading: false,
    walletAddress: "",
    page: 0,
    showPopup: false,
    selectedWallet: "",
    swapType: SWAP_TYPE.BDX_TO_BBDX,
    address: "",
    amount: 0,
    info: {},
    swapInfo: {},
    swaps: [],
    unconfirmed: [],
    walletConnBin: false,
    walletConnMeta: false,
    SwapSelection: "",
  };
  componentWillMount() {
    this.onInfoUpdated();
    store.on(Events.ERROR, this.onError);
    store.on(Events.FETCHED_INFO, this.onInfoUpdated);
    store.on(Events.FETCHED_SWAPS, this.onSwapsFetched);
    store.on(
      Events.FETCHED_UNCONFIRMED_BELDEX_TXS,
      this.onUnconfirmedTransactionsFetched
    );
    store.on(Events.TOKEN_SWAPPED, this.onTokenSwapped);
    store.on(Events.TOKEN_SWAP_FINALIZED, this.onTokenSwapFinalized);
    store.on(Events.TRANSACTION_INFO, this.transactionsInfo);
  }
  componentDidMount() {
    dispatcher.dispatch({ type: Actions.GET_INFO });
  }
  componentWillUnmount() {
    store.removeListener(Events.ERROR, this.onError);
    store.removeListener(Events.FETCHED_INFO, this.onInfoUpdated);
    store.removeListener(Events.FETCHED_SWAPS, this.onSwapsFetched);
    store.removeListener(
      Events.FETCHED_UNCONFIRMED_BELDEX_TXS,
      this.onUnconfirmedTransactionsFetched
    );
    store.removeListener(Events.TOKEN_SWAPPED, this.onTokenSwapped);
    store.removeListener(
      Events.TOKEN_SWAP_FINALIZED,
      this.onTokenSwapFinalized
    );
    store.removeListener(Events.TRANSACTION_INFO, this.transactionsInfo);
  }
  onError = (error) => {
    const isWarning = error instanceof Warning;
    const message = error.message;
    const variant = isWarning ? "warning" : "error";
    this.props.showMessage(message, variant);
    this.setState({ loading: false });
  };
  transactionsInfo = (transaction) => {
    console.log("transaction info:");
    this.props.showMessage("Transaction success.", "success");
  };
  onUnconfirmedTransactionsFetched = (transactions) => {
    this.setState({ unconfirmed: transactions });
  };
  onSwapsFetched = (swaps) => {
    this.setState({ swaps, loading: false });
  };
  onTokenSwapped = (swapInfo) => {
    this.setState({ swapInfo, page: 1 }, async () => {
      const { walletAddress, swapType, amount, selectedWallet } = this.state;
      if (swapType === SWAP_TYPE.BBDX_TO_BDX && walletAddress) {
        const result = await this.contract.methods
          .balanceOf(walletAddress)
          .call();
        // const balance = this.web3Obj.utils.fromWei(result?.toString());
        const balance = result / 1e9;
        if (swapType === SWAP_TYPE.BBDX_TO_BDX && walletAddress) {
          if (parseFloat(amount) > parseFloat(balance)) {
            this.props.showMessage(
              `Entered WBDX amount is exceeding the balance.`,
              "error"
            );
          } else if (parseFloat(amount) > 0) {
            this.makeTransaction();
          } else {
            this.props.showMessage(`Amount should be greater than 0`, "error");
          }
        } else {
          this.props.showMessage(
            `Connect to ${selectedWallet === "" ? "Wallet" : selectedWallet}`,
            "error"
          );
        }
      }
    });
    setImmediate(() => this.getUnconfirmedTransactions());
    setImmediate(() => this.getSwaps());
  };
  connectToMetaMask = async () => {
    const provider = window.ethereum;
    const binanceTestChainId = "0x38";
    this.web3Obj = new Web3(window.ethereum);
    // let provider=new Web3(window.ethereum)
    try {
      window.ethereum.enable();
      console.log("this.web3Obj ::", this.web3Obj);
      if (this.web3Obj) {
        console.log("chainId ::1");
        // web3..then(console.log);
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log("chainId 2::", chainId);

        if (chainId === binanceTestChainId) {
          console.log("Bravo!, you are on the correct network");
        } else {
          console.log("oulalal, switch to the correct network");
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: binanceTestChainId }],
            });
            console.log("You have succefully switched to Binance network");
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === -32602) {
              console.log(
                "This network is not available in your metamask, please add it"
              );
              try {
                await provider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "56",
                      chainName: "Smart Chain",
                      rpcUrls: [" https://bsc-dataseed.binance.org/"],
                      blockExplorerUrls: ["https://bscscan.com"],
                      nativeCurrency: {
                        symbol: "BNB", // 2-6 characters long
                        decimals: 18,
                      },
                    },
                  ],
                });
              } catch (addError) {
                // handle "add" error
                console.log(addError);
              }
            }
          }
        }
        let address = setInterval(() => {
          this.web3Obj.eth.getCoinbase((err, res) => {
            if (res) {
              this.setState({
                walletConnMeta: true,
              });
              this.contract = new this.web3Obj.eth.Contract(
                matrixAbi,
                process.env.REACT_APP_CONTRACT_ADDR
              );
              clearInterval(address);
              this.setState({ walletAddress: res });
              window.ethereum.on("accountsChanged", async (accounts) => {
                const address = accounts[0] || null;
                this.setState({ walletAddress: address });
              });
            }
          });
        }, 500);
      }
    } catch (error) {
      return false;
    }
  };
  connectToBinance = async () => {
    this.web3Obj = new Web3(window.BinanceChain);
    try {
      await window.BinanceChain.enable();
      if (this.web3Obj) {
        this.setState({
          walletConnBin: true,
        });
        const accounts = await window.BinanceChain.request({
          method: "eth_accounts",
        });
        const address = accounts[0] || null;
        this.contract = new this.web3Obj.eth.Contract(
          matrixAbi,
          process.env.REACT_APP_CONTRACT_ADDR
        );
        this.setState({ walletAddress: address });
        window.BinanceChain.on("accountsChanged", async (accounts) => {
          const address = accounts[0] || null;
          this.setState({ walletAddress: address });
        });
      }
    } catch (error) {
      return false;
    }
  };
  makeTransaction = () => {
    const { amount, walletAddress, swapInfo } = this.state;
    // let amountToWei = this.web3Obj.utils.toHex(amount);
    let amountToWei = amount * 1e9;
    const options = {
      from: walletAddress,
      to: this.contract._address,
      data: this.contract.methods
        .transfer(
          swapInfo.depositAddress,
          this.web3Obj.utils.toHex(amountToWei)
        )
        .encodeABI(),
      // data: this.contract.methods.transfer('0xBfBf227B5dFF318cfF17713C1ECDfF917157cceC', this.web3Obj.utils.toHex(amountToWei)).encodeABI(),
      value: 0x0,
    };
    this.web3Obj.eth
      .sendTransaction(options)
      .on("confirmation", (confirmationNumber, receipt) => {
        const timestamp = Math.floor(new Date().getTime() / 1000.0);
        if (confirmationNumber === 0) {
          const reqObj = {
            uuid: swapInfo.uuid,
            amount: amount,
            timestamp: timestamp,
            memo: swapInfo.memo,
            hash: receipt.transactionHash,
          };
          dispatcher.dispatch({
            type: Actions.SEND_TRANSACTION_HASH,
            content: reqObj,
          });
        }
      })
      .on("error", (error) => {
        dispatcher.dispatch({
          type: Actions.SEND_TRANSACTION_ERROR_LOG,
          content: {
            reqObj: { ...options, error: error?.code ? error : error.message },
          },
        });
        if (error?.code === 4001) {
          this.props.showMessage("User denied transaction signature.", "error");
        } else {
          this.props.showMessage(error, "error");
        }
      });
  };
  onTokenSwapFinalized = (transactions) => {
    this.setState({ loading: false });
    const message =
      transactions.length === 1
        ? "Added 1 new swap"
        : `Added ${transactions.length} new swaps`;
    this.props.showMessage(message, "success");
    setImmediate(() => this.getUnconfirmedTransactions());
    setImmediate(() => this.getSwaps());
  };
  onInfoUpdated = () => {
    this.setState({ info: store.getStore("info") || {} });
  };
  // onNext = async () => {
  //   const { page } = this.state;
  //   switch (page) {
  //     case 0:
  //       this.swapToken();
  //       break;
  //     case 1:
  //       this.finalizeSwap();
  //       break;
  //     default:
  //   }
  // }
  onNext = async () => {
    const { page, walletAddress,swapType } = this.state;
    console.log("onNext 1::", page, walletAddress, 'type ::',swapType);
    if (this.web3Obj && walletAddress && swapType !=='bdx_to_bbdx') {
      console.log("onNext 2::", this.web3Obj);

      let gasPri = await this.web3Obj.eth.getGasPrice();
      let estimate = await this.web3Obj.eth.estimateGas({
        from: walletAddress,
      });
      // let bnbUsdPrice = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`);
      // console.log("USDT-Value:", (this.web3Obj.utils.fromWei(gasPri, 'ether') * estimate) * bnbUsdPrice.data.binancecoin.usd)
      console.log("onNext 3::", gasPri, estimate);

      this.web3Obj.eth.getBalance(walletAddress).then((data) => {
        const walletBalance = data / 1e18;
        console.log("onNext 4::", walletBalance);
        console.log(
          "onNext 5 fee::",
          this.web3Obj.utils.fromWei(gasPri, "ether") * estimate
        );

        if (
          walletBalance >
          this.web3Obj.utils.fromWei(gasPri, "ether") * estimate
        ) {
          console.log(
            "onNext 6 fee::",
            this.web3Obj.utils.fromWei(gasPri, "ether") * estimate
          );

          // we can mention here minimum balance.
          switch (page) {
            case 0:
              this.swapToken();
              break;
            case 1:
              this.finalizeSwap();
              break;
            default:
          }
        } else {
          const errMsg = `Insufficient gas fee in your Binance wallet.`;
          console.log("onNext 7 fee::", errMsg);

          this.props.showMessage(errMsg, "error");
        }
      });
    } else {
      const { swapType } = this.state;
      if (swapType !== SWAP_TYPE.BDX_TO_BBDX) {
        this.props.showMessage("Please connect the available wallet.", "error");
        this.setState({ showPopup: !this.state.showPopup });
      } else {
        this.swapToken();
      }
    }
  };
  resetState = () => {
    this.setState({
      loading: false,
      page: 0,
      address: "",
      swapInfo: {},
      swaps: [],
      unconfirmed: [],
      swapType: SWAP_TYPE.BDX_TO_BBDX,
      amount: 0,
    });
  };
  getUnconfirmedTransactions = () => {
    const { swapType, swapInfo } = this.state;
    if (swapType !== SWAP_TYPE.BDX_TO_BBDX) return;
    dispatcher.dispatch({
      type: Actions.GET_UNCONFIRMED_BELDEX_TXS,
      content: {
        uuid: swapInfo.uuid,
      },
    });
  };
  getSwaps = () => {
    const { swapInfo } = this.state;
    dispatcher.dispatch({
      type: Actions.GET_SWAPS,
      content: {
        uuid: swapInfo.uuid,
      },
    });
    this.setState({ loading: true });
  };
  swapToken = () => {
    const { swapType, address } = this.state;
    dispatcher.dispatch({
      type: Actions.SWAP_TOKEN,
      content: {
        type: swapType,
        address,
      },
    });
    this.setState({ loading: true });
  };
  onRefresh = () => {
    this.getUnconfirmedTransactions();
    this.getSwaps();
    this.finalizeSwap();
  };
  finalizeSwap = () => {
    const { swapInfo } = this.state;
    dispatcher.dispatch({
      type: Actions.FINALIZE_SWAP_TOKEN,
      content: {
        uuid: swapInfo.uuid,
      },
    });
    this.setState({ loading: true });
  };
  renderReceivingAmount = () => {
    const { classes } = this.props;
    const { swapType, swaps, info } = this.state;
    if (!swaps) return null;
    const receivingCurrency =
      swapType === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;
    const pendingSwaps = swaps.filter(
      (s) => s.transferTxHashes && s.transferTxHashes.length === 0
    );
    const total = pendingSwaps.reduce(
      (total, swap) => total + parseFloat(swap.amount),
      0
    );
    const { fees } = info;
    const fee = (fees && fees[receivingCurrency]) || 0;
    const displayTotal = Math.max(0, total - fee) / 1e9;
    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        className={classes.txHeader}
      >
        <Typography className={classes.statTitle}>Amount Due:</Typography>
        <Typography className={classes.statAmount}>
          {displayTotal} {currencySymbols[receivingCurrency]}
        </Typography>
      </Box>
    );
  };
  renderTransactions = () => {
    const { classes } = this.props;
    const { swaps, unconfirmed, swapType } = this.state;
    const unconfirmedTxs =
      swapType === SWAP_TYPE.BDX_TO_BBDX ? unconfirmed : [];
    const unconfirmedSwaps = unconfirmedTxs.map(
      ({ hash, amount, created }) => ({
        uuid: hash,
        type: SWAP_TYPE.BDX_TO_BBDX,
        amount,
        txHash: hash,
        transferTxHashes: [],
        created,
        unconfirmed: true,
      })
    );
    const merged = [...unconfirmedSwaps, ...swaps];
    return (
      <Grid className={classes.swapList}>
        <Box
          display="flex"
          flexDirection="column"
          className={classes.section}
          style={{ paddingTop: "0" }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            style={{ height: "71px" }}
          >
            <Typography className={classes.transactionTitle}>
              Transactions
            </Typography>
            {this.renderReceivingAmount()}
          </Box>
          <Grid className={classes.sectionSwap} item xs={12}>
            <SwapList swaps={merged} />
          </Grid>
        </Box>
      </Grid>
    );
  };
  swapTypeChanged = async (swapType) => {
    const { walletAddress } = this.state;
    this.setState({ swapType }, async () => {
      if (swapType === SWAP_TYPE.BBDX_TO_BDX) {
        if (walletAddress === "" && window.innerWidth > 720) {
          // this.connectToMetaMask();
          this.setState({ showPopup: !this.state.showPopup });
        }
      }
    });
  };
  handlePopupClose = (value) => {
    this.setState(
      { showPopup: !this.state.showPopup, selectedWallet: value },
      async () => {
        if (this.state.selectedWallet === "Binance") {
          const account = await window.BinanceChain.request({
            method: "eth_requestAccounts",
          });
          if (account) this.connectToBinance();
        } else if (this.state.selectedWallet === "Metamask") {
          const account = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (account) this.connectToMetaMask();
        }
      }
    );
  };
  renderSelection = (props, totalSupply, movedBalance) => {
    const { classes } = props;
    const { loading, swapType, info, showPopup, selectedWallet } = this.state;
    return (
      <Grid container className={classes.registerWrapper}>
        <Grid xs={12} md={5}>
          <div className={classes.leftPane}>
            <p className="appName">
              <span className="beldexName">Beldex</span> Bridge
            </p>
            <p className="app-left-content">
              The Beldex bridge connects the Beldex network with the BNB Smart
              Chain network. Here you can swap BDX to wBDX and vice versa.
              Explore trading and DeFi opportunities in the BNB Smart Chain with
              wrapped BDX.
            </p>
          </div>
        </Grid>
        <Grid xs={12} md={7}>
          <div className={classes.rightPaneWrapper}>
            <SwapSelection
              swapType={swapType}
              info={info}
              totalSupply={totalSupply}
              movedBalance={movedBalance}
              onSwapTypeChanged={(swapType) => this.swapTypeChanged(swapType)}
              onNext={(address, amount) => {
                this.setState({ address, amount });
                // Wait for state to refresh correctly
                setImmediate(() => this.onNext());
              }}
              loading={loading}
              connectToMetaMask={() => this.connectToMetaMask()}
            />
          </div>
          <Popup
            selectedValue={selectedWallet}
            open={showPopup}
            onClose={this.handlePopupClose}
          />
        </Grid>
      </Grid>
    );
  };

  goBack = () => {
    window.location.reload();
  };

  renderInfo = (movedBalance, totalSupply) => {
    const { classes } = this.props;
    const {
      loading,
      swapType,
      swapInfo,
      info,
      walletConnMeta,
      walletConnBin,
      selectedWallet,
      SwapSelection,
    } = this.state;
    return (
      <React.Fragment>
        <Grid className={classes.dashBoard}>
          <Typography
            style={{ cursor: "pointer" }}
            className={classes.backBox}
            onClick={this.goBack}
          >
            {/* <Link > */}
            <img alt="" src={Back} className={classes.backImg} />
            <Typography className={classes.backTxt}>Back</Typography>
            {/* </Link> */}
          </Typography>
          <Grid>
            <div className="movedBal">
              <p className="bal-title">
                Total{" "}
                <span style={{ color: "rgba(0, 173, 7, 0.93)" }}>
                  &nbsp;BDX&nbsp;
                </span>{" "}
                moved to Binance smart chain
              </p>
              <p className="movedBal-p2">
                {/* <span className="movedBal-p2" style={{ marginLeft: "10px" }}> */}
                <span className="balance-span">{movedBalance} </span>
                <span className="availBal">/ {totalSupply}</span>
                {/* </span> */}
              </p>
            </div>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              className={classes.item}
              // style={{ marginTop: "20px" }}
            >
              <SwapInfo
                swapType={swapType}
                swapInfo={swapInfo}
                info={info}
                selectedWallet={selectedWallet}
                onRefresh={this.onRefresh}
                onBack={this.resetState}
                connectToMetaMask={() => this.connectToMetaMask()}
                loading={loading}
                walletConnected={
                  selectedWallet === "Binance" ? walletConnBin : walletConnMeta
                }
              />
            </Grid>
            <Grid item xs={12} md={6} style={{ marginTop: "20px" }}>
              {this.renderTransactions()}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };
  render() {
    const { classes, totalSupply, movedBalance } = this.props;
    const { page } = this.state;
    return (
      <Grid container className={classes.root} spacing={2}>
        {page === 0 &&
          this.renderSelection(this.props, totalSupply, movedBalance)}
        {page === 1 && this.renderInfo(movedBalance, totalSupply)}
        <div className={classes.bottomSpacing}></div>
      </Grid>
    );
  }
}
Swap.propTypes = {
  classes: PropTypes.object.isRequired,
  showMessage: PropTypes.func.isRequired,
};
export default withStyles(styles)(Swap);

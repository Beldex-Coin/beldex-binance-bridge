import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Box } from '@material-ui/core';
import { Warning } from '@utils/error';
import { store, dispatcher, Actions, Events } from '@store';
import { SWAP_TYPE, TYPE } from '@constants';
import { SwapSelection, SwapInfo, SwapList } from '@components';
import styles from './styles';
import matrixAbi from '../../matrixAbi';

const currencySymbols = {
  [TYPE.BDX]: 'BDX',
  [TYPE.BNB]: 'B-BDX'
};

class Swap extends Component {
  state = {
    loading: false,
    metaMaskAddress: '',
    page: 0,
    swapType: SWAP_TYPE.BDX_TO_BBDX,
    address: '',
    amount: 0,
    info: {},
    swapInfo: {},
    swaps: [],
    unconfirmed: [],

  };

  componentWillMount() {
    this.onInfoUpdated();
    store.on(Events.ERROR, this.onError);
    store.on(Events.FETCHED_INFO, this.onInfoUpdated);
    store.on(Events.FETCHED_SWAPS, this.onSwapsFetched);
    store.on(Events.FETCHED_UNCONFIRMED_BELDEX_TXS, this.onUnconfirmedTransactionsFetched);
    store.on(Events.TOKEN_SWAPPED, this.onTokenSwapped);
    store.on(Events.TOKEN_SWAP_FINALIZED, this.onTokenSwapFinalized);
    store.on(Events.TRANSACTION_INFO, this.transactionsInfo);
  }

  componentDidMount() {
    this.connectToMetaMask();
    dispatcher.dispatch({ type: Actions.GET_INFO });
  }

  componentWillUnmount() {
    store.removeListener(Events.ERROR, this.onError);
    store.removeListener(Events.FETCHED_INFO, this.onInfoUpdated);
    store.removeListener(Events.FETCHED_SWAPS, this.onSwapsFetched);
    store.removeListener(Events.FETCHED_UNCONFIRMED_BELDEX_TXS, this.onUnconfirmedTransactionsFetched);
    store.removeListener(Events.TOKEN_SWAPPED, this.onTokenSwapped);
    store.removeListener(Events.TOKEN_SWAP_FINALIZED, this.onTokenSwapFinalized);
    store.removeListener(Events.TRANSACTION_INFO, this.transactionsInfo);
  }

  onError = (error) => {
    const isWarning = error instanceof Warning;
    const message = error.message;
    const variant = isWarning ? 'warning' : 'error';
    this.props.showMessage(message, variant);
    this.setState({ loading: false });
  }

  transactionsInfo = (transaction) => {
    this.props.showMessage('Transaction success.', 'success');
  }

  onUnconfirmedTransactionsFetched = (transactions) => {
    this.setState({ unconfirmed: transactions });
  }

  onSwapsFetched = (swaps) => {
    this.setState({ swaps, loading: false });
  }

  onTokenSwapped = (swapInfo) => {
    this.setState({ swapInfo, page: 1 });
    if (swapInfo.type === TYPE.BNB) this.makeTransaction() //this.connectToMetaMask();
    setImmediate(() => this.getUnconfirmedTransactions());
    setImmediate(() => this.getSwaps());
  }

  connectToMetaMask = async () => {
    this.web3Obj = new Web3(window.ethereum);
    try {
      window.ethereum.enable();
      if (this.web3Obj) {
        let address = setInterval(() => {
          this.web3Obj.eth.getCoinbase((err, res) => {
            if (res) {
              this.contract = new this.web3Obj.eth.Contract(matrixAbi, '0x56036904a3c18A633dCBeF3538f1128ec314c9bf');
              clearInterval(address);
              this.setState({ metaMaskAddress: res });
            }
          });
        }, 500);
      }
    } catch (error) {
      return false;
    }
  }

  makeTransaction = () => {
    const { amount, metaMaskAddress, swapInfo } = this.state;
    let amountToWei = this.web3Obj.utils.toWei(amount);
    const options = {
      from: metaMaskAddress,
      to: this.contract._address,
      data: this.contract.methods.transfer('0x4d51B331a00778d5B501FB3819A2f9ED23f63B7F', this.web3Obj.utils.toHex(amountToWei)).encodeABI(),
      value: 0x0
    };
    console.log('---reqObj--', this.state);

    this.web3Obj.eth.sendTransaction(options)
      // .on('transactionHash', (hash) => {
      //   console.log('-transactionHash--', hash);
      // })
      // .on('receipt', (receipt) => {
      //   console.log('-receipt--', receipt);
      // })
      .on('confirmation', (confirmationNumber, receipt) => {
        const timestamp = Math.floor(new Date().getTime() / 1000.0);
        if(confirmationNumber === 0) {
          const reqObj = {
            uuid: swapInfo.uuid,
            amount: amount,
            timestamp: timestamp,
            memo: swapInfo.memo,
            hash: receipt.transactionHash
          }
          dispatcher.dispatch({
            type: Actions.SEND_TRANSACTION_HASH,
            content: reqObj
          });
        }
      })
      .on('error', console.error);
  }
  onTokenSwapFinalized = (transactions) => {
    this.setState({ loading: false });
    const message = transactions.length === 1 ? 'Added 1 new swap' : `Added ${transactions.length} new swaps`;
    this.props.showMessage(message, 'success');

    setImmediate(() => this.getUnconfirmedTransactions());
    setImmediate(() => this.getSwaps());
  }

  onInfoUpdated = () => {
    this.setState({ info: store.getStore('info') || {} });
  }

  onNext = () => {
    console.log('-this.state.page--', this.state.page)
    switch (this.state.page) {
      case 0:
        this.swapToken();
        break;
      case 1:
        this.finalizeSwap();
        break;
      default:

    }
  }

  resetState = () => {
    this.setState({
      loading: false,
      page: 0,
      address: '',
      swapInfo: {},
      swaps: [],
      unconfirmed: [],
      swapType: SWAP_TYPE.BDX_TO_BBDX,
      amount: 0,
    });
  }

  getUnconfirmedTransactions = () => {
    const { swapType, swapInfo } = this.state;
    if (swapType !== SWAP_TYPE.BDX_TO_BBDX) return;
    dispatcher.dispatch({
      type: Actions.GET_UNCONFIRMED_BELDEX_TXS,
      content: {
        uuid: swapInfo.uuid
      }
    });
  }

  getSwaps = () => {
    const { swapInfo } = this.state;
    dispatcher.dispatch({
      type: Actions.GET_SWAPS,
      content: {
        uuid: swapInfo.uuid
      }
    });
    this.setState({ loading: true });
  }

  swapToken = () => {
    const { swapType, address } = this.state;
    dispatcher.dispatch({
      type: Actions.SWAP_TOKEN,
      content: {
        type: swapType,
        address
      }
    });
    this.setState({ loading: true });
  }

  onRefresh = () => {
    this.getUnconfirmedTransactions();
    this.getSwaps();
    this.finalizeSwap();
  }

  finalizeSwap = () => {
    const { swapInfo } = this.state;
    dispatcher.dispatch({
      type: Actions.FINALIZE_SWAP_TOKEN,
      content: {
        uuid: swapInfo.uuid
      }
    });
    this.setState({ loading: true });
  }

  renderReceivingAmount = () => {
    const { classes } = this.props;
    const { swapType, swaps, info } = this.state;
    if (!swaps) return null;

    const receivingCurrency = swapType === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;

    const pendingSwaps = swaps.filter(s => s.transferTxHashes && s.transferTxHashes.length === 0);
    const total = pendingSwaps.reduce((total, swap) => total + parseFloat(swap.amount), 0);

    const { fees } = info;
    const fee = (fees && fees[receivingCurrency]) || 0;
    const displayTotal = Math.max(0, total - fee) / 1e9;

    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography className={classes.statTitle}>Amount Due:</Typography>
        <Typography className={classes.statAmount}>{displayTotal} {currencySymbols[receivingCurrency]}</Typography>
      </Box>
    );
  }

  renderTransactions = () => {
    const { classes } = this.props;
    const { swaps, unconfirmed, swapType } = this.state;

    const unconfirmedTxs = swapType === SWAP_TYPE.BDX_TO_BBDX ? unconfirmed : [];
    const unconfirmedSwaps = unconfirmedTxs.map(({ hash, amount, created }) => ({
      uuid: hash,
      type: SWAP_TYPE.BDX_TO_BBDX,
      amount,
      txHash: hash,
      transferTxHashes: [],
      created,
      unconfirmed: true,
    }));

    const merged = [...unconfirmedSwaps, ...swaps];

    return (
      <Grid item xs={12} md={6}>
        <Box display="flex" flexDirection="column" className={classes.section}>
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Typography className={classes.transactionTitle}>Transactions</Typography>
            {this.renderReceivingAmount()}
          </Box>
          <Grid item xs={12}>
            <SwapList swaps={merged} />
          </Grid>
        </Box>
      </Grid>
    );
  }

  renderSelection = (props, totalSupply, movedBalance) => {
    const { classes } = props;
    const { loading, swapType, info } = this.state;
    return (
      <Grid item xs={12} className={classes.item}>
        <SwapSelection
          swapType={swapType}
          info={info}
          totalSupply={totalSupply}
          movedBalance={movedBalance}
          onSwapTypeChanged={(swapType) => this.setState({ swapType })}
          onNext={(address, amount) => {
            this.setState({ address, amount });
            // Wait for state to refresh correctly
            setImmediate(() => this.onNext());
          }}
          loading={loading}
        />
      </Grid>
    );
  }

  renderInfo = () => {
    const { classes } = this.props;

    const { loading, swapType, swapInfo, info } = this.state;

    return (
      <React.Fragment>
        <Grid item xs={12} md={6} className={classes.item}>
          <SwapInfo
            swapType={swapType}
            swapInfo={swapInfo}
            info={info}
            onRefresh={this.onRefresh}
            onBack={this.resetState}
            loading={loading}
          />
        </Grid>
        {this.renderTransactions()}
      </React.Fragment>
    );
  }

  render() {
    const { classes, totalSupply, movedBalance } = this.props;
    const { page } = this.state;

    return (
      <Grid container className={classes.root} spacing={2}>
        { page === 0 && this.renderSelection(this.props, totalSupply, movedBalance)}
        { page === 1 && this.renderInfo()}
      </Grid>
    );
  };
}

Swap.propTypes = {
  classes: PropTypes.object.isRequired,
  showMessage: PropTypes.func.isRequired
};

export default withStyles(styles)(Swap);

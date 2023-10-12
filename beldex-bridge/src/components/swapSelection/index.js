import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Typography, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Input, Button } from "@components";
import { SWAP_TYPE, TYPE } from "@constants";
import config from "@config";
import styles from "./styles";
import { store, dispatcher, Actions, Events } from "@store";
import Swaptabs from "./swapTabs";

const walletCreationUrl = {
  [TYPE.BDX]: config.beldex.walletCreationUrl,
  [TYPE.BNB]: config.binance.walletCreationUrl,
};

class SwapSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "0xd90A3ABEDc6CdaA0DAc658881167C86D8c714D97",
      // address: "",

      amount: 0,
      addressError: false,
      options: [
        {
          value: SWAP_TYPE.BDX_TO_BBDX,
          description: "BDX to wBDX",
        },
        {
          value: SWAP_TYPE.BBDX_TO_BDX,
          description: "wBDX to BDX",
        },
      ],
      //loginOpen: props.totalSupply != props.movedBalance,
      totalSupply: props.totalSupply,
      movedBalance: props.movedBalance,
      swapType: "bdx_to_bbdx",
      loginOpen: false,
      amountError: false,
    };
  }

  componentDidMount = () => {
    store.on(Events.FETCHED_BALANCE, this.onBalUpdated);
    this.onNext()

  };

  onBalUpdated = () => {
    const balance = store.getStore("balance") || {};
    if (balance && balance.length > 0) {
      const bal = Number(
        parseFloat(balance[0].movedBalance).toFixed(2)
      ).toLocaleString("en", {
        minimumFractionDigits: 2,
      });
      const total = Number(
        parseFloat(balance[0].totalSupply).toFixed(2)
      ).toLocaleString("en", {
        minimumFractionDigits: 2,
      });
      if (this.state.swapType === "bdx_to_bbdx") {
        if (total === bal) {
          this.setState({ loginOpen: true });
        }
      } else {
        this.setState({ loginOpen: false });
      }
      this.setState({
        totalSupply: total,
        movedBalance: bal,
      });
    }
  };

  onNext = async () => {
    const { address, swapType, amount } = this.state;
    const { onNext } = this.props;

    const isValidAddress = address && address.length > 0;
    this.setState({ addressError: !isValidAddress });
    if (isValidAddress) {
      if (swapType === SWAP_TYPE.BBDX_TO_BDX) {
        onNext(address, amount);
      } else if (swapType === SWAP_TYPE.BDX_TO_BBDX) {
        onNext(address, "");
      }
    }
  };

  onAddressChanged = (event) => {
 
    const newValue = event.target.value.replace(/[^A-Za-z0-9]/g, '');
      this.setState({ address:newValue});

  
  };
  
  onAmountChanged = (event) => {
    if (
      (this.props.info.fees && this.props.info.fees.bdx / 1e9) >=
      event.target.value
    ) {
      this.setState({
        amountError: "Entered amount should be greater than the swap fee.",
      });
    } else {
      this.setState({ amountError: "" });
    }
    const value = event.target.value
    // Use a regular expression to allow numbers, including integers and floats
    const newValue = value.replace(/[^0-9.]/g, '');

    // Ensure that there's only one decimal point
    const decimalCount = newValue.split('.').length - 1;
    if (decimalCount > 1) {
      return;
    }
    // .replace(/[^0-9]/g, '');

    this.setState({ amount:newValue});
  };

  onSwapTypeChanged = (value) => {
    console.log("valuee:", value)
    if (this.state.swapType !== value) {
      this.state.address = '';
      this.state.amount = 0;
    }
    this.props.onSwapTypeChanged(value);
    this.setState({
      swapType: value,
    });
    dispatcher.dispatch({
      type: Actions.GET_BALANCE,
    });
  };

  getAddressType = () => {
    const { swapType } = this.props;
    return swapType === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;
  };
  loginClose = () => {
    this.setState({ loginOpen: false });
  };
  render() {
    const { loading, classes } = this.props;
    const { address, addressError, amount } = this.state;
    const addressType = this.getAddressType();
    const inputLabel = addressType === TYPE.BDX ? "BDX Address" : "BNB Address";
    const inputPlaceholder = addressType === TYPE.BDX ? "bdx..." : "wbdx...";

    const url = walletCreationUrl["bnb"];
    return (
      <Grid item xs={12} className={classes.root}>
        <div className="movedBal">
          <p className="bal-title">
            Total <span style={{ color: "rgba(0, 173, 7, 0.93)" }}>&nbsp;
              BDX &nbsp;
            </span>{" "}
            moved to Binance smart chain
          </p>
          <p className="movedBal-p2">
            <span className="balance-span">
              {this.state.movedBalance}{" "}
            </span>
            <span className="availBal">/ {this.state.totalSupply}</span>
          </p>
        </div>
        <Grid item xs={12} className={classes.swapTabs}>
          <Swaptabs
            handleChange={(val) => this.onSwapTypeChanged(val)}
            connectToMetaMask={() => this.props.connectToMetaMask()}
          />
        </Grid>

        <Grid item xs={12}>
          {/* <Select
            fullWidth
            label="Swap Type"
            options={options}
            value={swapType}
            handleChange={this.onSwapTypeChanged}
            disabled={loading}
            className={classes.belSelect}
          /> */}
        </Grid>

        <Grid item xs={12}>
          <Input
            fullWidth
            label={inputLabel}
            placeholder={inputPlaceholder}
            value={address}
            error={addressError}
            type="text"
            onChange={this.onAddressChanged}
            disabled={loading}
             
            
          />
          {addressType === "bdx" && (
            <>
              <Input
                fullWidth
                label="Amount"
                placeholder="Amount"
                value={amount}
                type="text"
                onChange={this.onAmountChanged}
                disabled={loading}
                error={this.state.amountError}
              />
              <Typography style={{ color: "red", fontSize: "12px" }}>
                {this.state.amountError}
              </Typography>
            </>
          )}
          <Typography className={classes.swapFee}>
            Swap Fee : {this.props.info.fees && this.props.info.fees.bdx / 1e9}{" "}
            BDX
          </Typography>
        </Grid>
        <Grid item xs={12} align="right" className={classes.button}>
          <Button
            fullWidth
            label="Next"
            loading={loading}
            disabled={addressType === "bdx" ? !address || !amount : !address}
            onClick={this.onNext}
          />
        </Grid>
       
        {/* <Typography style={{ marginTop: this.state.swapType == 'bdx_to_bbdx' ? '153px' : '' }}></Typography> */}
        {/* <Link className={classes.belLink} href="BBDXBridgeTOS.html" target="_blank">Terms of Service</Link> */}
        {addressType === "bdx" && (
          <>
            {" "}
            <Typography
              className={`contract-address ${classes.wbdxAddressTitle}`}
              style={{ marginTop: "10px" }}
            >
              wBDX Contract address :
            </Typography>
            <Typography className={classes.wbdxAddress}>
              0x90bbdDbF3223363898065b9C736e2B86C655762b
            </Typography>
          </>
        )}
         <Typography
          style={{ marginTop: "10px" }}
          className={classes.createAccount}
        >
          <Link
            style={{ color: "#2FA6FF" }}
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            View on bscscan{" "}
          </Link>
        </Typography>
        {
          this.state.loginOpen && (
            <div className="warningText">
              <p>
                The maximum BDX swap limit was reached.<br></br> You can buy
                BBDX from{" "}
                <a
                  href="https://testnet.binance.org/en/trade/mini/175-0B3M_BNB"
                  style={{ color: "#67d040", textAlign: "center" }}
                >
                  Binance dex.
                </a>
              </p>
            </div>
          )
          // <LoginPopup open={this.state.loginOpen} loginClose={this.loginClose} />
        }
      </Grid>
    );
  }
}

SwapSelection.propTypes = {
  classes: PropTypes.object.isRequired,
  swapType: PropTypes.string.isRequired,
  onSwapTypeChanged: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withStyles(styles)(SwapSelection);

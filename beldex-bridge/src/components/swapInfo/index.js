import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import QRCode from "qrcode.react";
import AnimateHeight from "react-animate-height";
import {
  Grid,
  Typography,
  IconButton,
  Link,
  Tooltip,
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CopyIcon from "../../assets/icons/CopyIcon.svg";
import { Button, QRIcon } from "@components";
import { SWAP_TYPE } from "@constants";
import styles from "./styles";
import important from "./warning.png";
import QrCodeIcon from "../../assets/icons/QrCode.svg";

class SwapInfo extends PureComponent {
  state = {
    showQR: false,
    qrSize: 120,
  };

  onCopy = (id) => {
    var elm = document.getElementById(id);
    let range;
    // for Internet Explorer

    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(elm);
      range.select();
      document.execCommand("Copy");
    } else if (window.getSelection) {
      // other browsers
      var selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(elm);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("Copy");
    }
  };

  componentDidMount() {
    // Run a timer every 10 seconds to refresh
    this.timer = setInterval(this.props.onRefresh, 30 * 1000);

    this.onResize();
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    clearInterval(this.timer);
  }

  onResize = () => {
    const width = window.innerWidth;
    const qrSize = width <= 600 ? 128 : 150;
    this.setState({ qrSize });
  };

  toggleQR = () => {
    this.setState({ showQR: !this.state.showQR });
  };

  renderQR = () => {
    const { showQR, qrSize } = this.state;
    const { classes, swapInfo } = this.props;
    const { depositAddress } = swapInfo;
    const height = showQR ? "auto" : 0;

    return (
      <AnimateHeight duration={250} height={height}>
        <Box
          className={classes.qrContainer}
          style={{ width: qrSize + 57 + "px", height: qrSize + 57 + "px" }}
        >
          <Box className={classes.qr}>
            <QRCode value={depositAddress} renderAs="canvas" size={qrSize} />
          </Box>
        </Box>
        <div style={{ width: "20px", height: "2px" }}></div>
      </AnimateHeight>
    );
  };

  renderMemo = () => {
    const {
      classes,
      swapInfo: { memo },
    } = this.props;
    if (!memo) return null;

    return (
      <Box className={classes.memoFrame}>
        <Typography className={classes.warningText} style={{ color: "#000" }}>
          PLEASE READ CAREFULLY
        </Typography>
        {/* <Typography id='memo' className={classes.memo}>
          {memo}
        </Typography> */}
        {/* <Tooltip title="Copy Memo" placement="right">
          <IconButton onClick={() => this.onCopy('memo')} aria-label="Copy Memo">
            <CopyIcon style={{ fontSize: '20px' }} />
          </IconButton>
        </Tooltip> */}
        {/* <Typography className={classes.instructionBold}>
          When creating the transaction, please paste the string above into the <b>Memo</b> field. <br />
          Ensure that this is the only thing that you put in the field.
        </Typography> */}
        <Typography
          className={`blinkAnim ${clsx(classes.warningText, classes.red)}`}
        >
          Please send <b>wBDX</b> only to the address mentioned above, the
          amount sent to any other address will be lost.
          <img alt="" src={important} className="blinkImg" />
        </Typography>
      </Box>
    );
  };

  renderDepositInstructions = () => {
    const { swapType, classes, swapInfo } = this.props;

    const { depositAddress } = swapInfo;
    const depositCurrency = swapType === SWAP_TYPE.BDX_TO_BBDX ? "BDX" : "wBDX";

    return (
      <React.Fragment>
        <Typography className={classes.instructionBold}>
          Transfer your {depositCurrency} to
        </Typography>
        {/* <Typography className={classes.instructions}>
          to
        </Typography> */}
        <Typography
          component={"div"}
          style={{ borderRadius: "12px", background: "#282837" }}
        >
          <Typography component={"div"} className={classes.addressWrapper}>
            <Box id="depositAddress" className={classes.greenBorder}>
              {depositAddress}
            </Box>
            <Box>
              <Tooltip title="Copy Address" placement="left">
                <IconButton
                  onClick={() => this.onCopy("depositAddress")}
                  aria-label="Copy Address"
                >
                  <img alt="" src={CopyIcon} />

                  {/* <CopyIcon style={{ fontSize: '20px' }} /> */}
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle QR" placement="right">
                <IconButton onClick={this.toggleQR} aria-label="Toggle QR">
                  <img alt="" src={QrCodeIcon} />

                  {/* <QRIcon style={{ filter: "invert(0)", fontSize: "18px" }} /> */}
                </IconButton>
              </Tooltip>
            </Box>
          </Typography>
          {this.renderQR()}
        </Typography>
        {/* {this.renderQR()} */}
        {this.renderMemo()}
      </React.Fragment>
    );
  };

  renderInstructions = () => {
    const { swapType, classes, info } = this.props;

    const beldexFee = (info && info.fees && info.fees.bdx / 1e9) || 0;

    return (
      <Box className={classes.instructionContainer}>
        {swapType === SWAP_TYPE.BDX_TO_BBDX && this.renderDepositInstructions()}

        {swapType === SWAP_TYPE.BBDX_TO_BDX && (
          <Typography className={classes.feeInfo}>
            There will be a processing fee of{" "}
            <span style={{ color: "#3EC745" }}>{beldexFee}</span> BDX which will
            be charged.
          </Typography>
        )}
        <Box className={classes.instructionWrapper}>
          <Typography style={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Note{" "}
          </Typography>
          {swapType === SWAP_TYPE.BDX_TO_BBDX && (
            <>
              <Typography className={classes.instructions}>
                You will have to wait for the transaction to be checkpointed
                before you're added to our processing queue, this usually takes
                8 blocks.
              </Typography>
            </>
          )}

          <Typography className={classes.instructions}>
            If you run into any trouble, or your swap request has not gone
            through, please contact @Beldexadmin on telegram.
          </Typography>
        </Box>
      </Box>
    );
  };

  renderReceivingAmount = () => {
    const { classes, swapType, swapInfo } = this.props;
    if (!swapInfo || !swapInfo.swaps || swapInfo.swaps.length === 0)
      return null;

    const receivingCurrency =
      swapType === SWAP_TYPE.BDX_TO_BBDX ? "wBDX" : "BDX";

    const pendingSwaps = swapInfo.swaps.filter(
      (s) => s.transferTxHashes && s.transferTxHashes.length === 0
    );
    const total = pendingSwaps.reduce(
      (total, swap) => total + parseFloat(swap.amount),
      0
    );
    const displayTotal = total / 1e9;

    return (
      <Grid item xs={12} align="right" className={classes.stats}>
        <Typography className={classes.statTitle}>Pending Amount:</Typography>
        <Typography className={classes.statAmount}>
          {displayTotal} {receivingCurrency}
        </Typography>
      </Grid>
    );
  };

  // goBack = () => {
  //   window.location.reload()
  // }

  render() {
    const {
      classes,
      loading,
      onRefresh,
      walletConnected,
      swapType,
      selectedWallet,
    } = this.props;
    return (
      <div className={classes.root}>
        <Grid item xs={12} align="left" className={classes.back}>
          {/* <Typography>
            <Link className={classes.link} onClick={this.goBack}>
              &lt; Back
            </Link>
          </Typography> */}

          {swapType !== SWAP_TYPE.BDX_TO_BBDX && (
            <Box className={classes.walletConWrapper}>
              
              {!walletConnected ? (
                <Typography className={classes.walletConnErr}>
                  wallet not connected. Please connect your wallet.
                </Typography>
              ) : (
                <Typography className={classes.walletConnSucc}>
                  {selectedWallet} Wallet Connected
                </Typography>
              )}
            </Box>
          )}
        </Grid>
        {this.renderInstructions()}
        <Grid item xs={12} className={classes.button}>
          <Button
            fullWidth
            label="Refresh"
            loading={loading}
            onClick={onRefresh}
          />
        </Grid>
        {/* <Link href="BBDXBridgeTOS.html" target="_blank" style={{ textAlign: 'center', margin: '10px auto 0', display: 'inherit', fontSize: '14px' }}>Terms of Service</Link> */}

        <Typography
          className={`contract-address ${classes.wbdxAddressTitle}`}
          style={{ marginTop: "20px" }}
        >
          wBDX Contract address
        </Typography>
        <Typography
          className={classes.wbdxAddressTitle}
          style={{ color: "#EBEBEB" }}
        >
          0x90bbdDbF3223363898065b9C736e2B86C655762b
        </Typography>
      </div>
    );
  }
}

SwapInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  swapType: PropTypes.string.isRequired,
  swapInfo: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withStyles(styles)(SwapInfo);

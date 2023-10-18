import React, { Component } from "react";
import PropTypes from "prop-types";
import TimeAgo from "timeago-react";
import dateformat from "dateformat";
import { Grid, Typography, Box, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import config from "@config";
import { SWAP_TYPE, TYPE } from "@constants";
import styles from "./styles";
import Pending from "./pending.svg";
import Completed from "./completed.svg";
import EmptyTransaction from "./no_transaction.svg";
import { withTranslation } from "react-i18next";
const hashUrls = {
  [TYPE.BDX]: config.beldex.txExplorerUrl,
  [TYPE.BNB]: config.binance.txExplorerUrl,
};

class SwapList extends Component {
  renderHash = (type, txHash, transferTxHashes, created) => {
    const { classes, t } = this.props;
    const hasTransferHashes = transferTxHashes.length > 0;
    const depositHashType =
      type === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BDX : TYPE.BNB;
    const transferHashType =
      type === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;
    const hashType = hasTransferHashes ? transferHashType : depositHashType;
    const baseUrl = hashUrls[hashType];
    const hashes = hasTransferHashes ? transferTxHashes : [txHash];
    const hashItems = hashes.map((hash) => {
      const url = `${baseUrl}${hash}`;
      return (
        <Typography key={hash} className={classes.hash}>
          <Link href={url} target="_blank" rel="noreferrer">
            {hash}
          </Link>
        </Typography>
      );
    });

    if (transferTxHashes.length === 0) {
      return (
        <Box className={classes.hashBox}>
          <Typography className={classes.hashTitle}>
            {t("depositTransactionHash")}
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={classes.TxDetails}
          >
            <Typography className={classes.hashes}> {hashItems[0]}</Typography>
            <Typography style={{ textAlign: "right" }}>
              {this.renderTime(created)}
            </Typography>
          </Box>
        </Box>
      );
    }

    const swapTitle =
      transferTxHashes.length === 1
        ? t("swapTransactionHash")
        : t("swapTransactionHashes");
    return (
      <React.Fragment>
        <Box className={classes.hashBox}>
          <Typography className={classes.hashTitle}>{swapTitle}</Typography>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={classes.TxDetails}
          >
            <Typography className={classes.hashes}> {hashItems}</Typography>
            <Typography style={{ textAlign: "right" }}>
              {this.renderTime(created)}
            </Typography>
          </Box>
        </Box>
      </React.Fragment>
    );
  };

  renderTime = (created) => {
    const { classes } = this.props;
    const now = Date.now();
    const timestamp = Date.parse(created);
    const diff = Math.abs(now - timestamp);
    const dayMs = 24 * 60 * 60 * 1000;
    const showFullDate = diff > dayMs;
    if (showFullDate) {
      const formatted = dateformat(timestamp, "dd/mm/yyyy");
      return <Typography className={classes.time}>{formatted}</Typography>;
    }
    return <TimeAgo className={classes.time} datetime={timestamp} />;
  };

  renderSwapItem = ({
    uuid,
    type,
    amount,
    txHash,
    transferTxHashes,
    created,
    unconfirmed,
  }) => {
    const { classes, t } = this.props;

    const isPending = transferTxHashes && transferTxHashes.length === 0;
    const depositCurrency = type === SWAP_TYPE.BDX_TO_BBDX ? "BDX" : "wBDX";
    const displayAmount = amount / 1e9;

    let status = "Completed";
    if (isPending) {
      status = unconfirmed ? t("waitingForConfirmations") : t("pending");
    }

    return (
      <Grid item xs={12} key={uuid}>
        <Box className={classes.item}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={classes.txnStatusHeader}
          >
            <Typography className={classes.amount}>
              {displayAmount} {depositCurrency}
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                className={isPending ? classes.pending : classes.completed}
                style={{ padding: "0px 3px 0px" }}
              >
                {status}
              </Typography>
              <img
                alt=""
                src={isPending ? Pending : Completed}
                className={classes.statusImg}
              />
            </Box>
          </Box>
          {this.renderHash(type, txHash, transferTxHashes, created)}
        </Box>
      </Grid>
    );
  };

  renderSwaps = () => {
    const { classes, swaps, t } = this.props;
    if (!swaps || swaps.length === 0) {
      return (
        <Box>
          <Box className={classes.emptyTxnWrapper}>
            <img alt="" src={EmptyTransaction} />
            <Typography className={classes.emptyTitle}>
              {t("noTransactions")}
            </Typography>
          </Box>
        </Box>
      );
    }

    return swaps.map(this.renderSwapItem);
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid item xs={12} className={classes.root}>
        <Grid container direction="column" spacing={1} xs={12}>
          {this.renderSwaps()}
        </Grid>
      </Grid>
    );
  }
}

SwapList.propTypes = {
  classes: PropTypes.object.isRequired,
  swaps: PropTypes.array,
};

export default withStyles(styles)(withTranslation()(SwapList));

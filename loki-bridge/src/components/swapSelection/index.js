import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Link } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Input, Button, Select } from '@components';
import { SWAP_TYPE, TYPE } from '@constants';
import config from '@config';
import styles from './styles';
import LoginPopup from './loginpop';
import Swaptabs from './swapTabs';

const walletCreationUrl = {
  [TYPE.BDX]: config.beldex.walletCreationUrl,
  [TYPE.BNB]: config.binance.walletCreationUrl,
};

class SwapSelection extends Component {
  state = {
    address: '',
    addressError: false,
    options: [{
      value: SWAP_TYPE.BDX_TO_BBDX,
      description: 'BDX to B-BDX',
    }, {
      value: SWAP_TYPE.BBDX_TO_BDX,
      description: 'B-BDX to BDX',
    }],
    loginOpen: false,
  };

  onNext = () => {
    const { address } = this.state;
    const { onNext } = this.props;

    const isValidAddress = address && address.length > 0;
    this.setState({ addressError: !isValidAddress });

    if (isValidAddress) onNext(address);
  }

  onAddressChanged = (event) => {
    this.setState({ address: event.target.value });
  }

  onSwapTypeChanged = (event) => {
    this.props.onSwapTypeChanged(event.target.value);
    console.log(event.target.value)
    if (event.target.value== "bdx_to_bbdx")
    {
      this.setState({loginOpen: true})
    }
  }

  getAddressType = () => {
    const { swapType } = this.props;
    return swapType === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;
  }
  loginClose = () => {
    this.setState({loginOpen: false})
  }
  render() {
    const { swapType, loading, classes } = this.props;
    const { options, address, addressError } = this.state;
    const addressType = this.getAddressType();
    const inputLabel = addressType === TYPE.BDX ? 'BDX Address' : 'BNB Address';
    const inputPlaceholder = addressType === TYPE.BDX ? 'bdx...' : 'bbdx...';

    const url = walletCreationUrl[addressType];
    return (
      <Grid item xs={ 12 } className={classes.root}>

        <Grid item xs={ 12 } className={classes.swapTabs}>
        <Swaptabs />
        </Grid>

        <Grid item xs={ 12 }>
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
        <Typography className={classes.swapFee}>
          Swap Fee : {this.props.info.fees && this.props.info.fees.bdx} {" "} BDX
        </Typography>
        
        <Grid item xs={ 12 }>
          <Input
            fullWidth
            label={inputLabel}
            placeholder={inputPlaceholder}
            value={address}
            error={addressError}
            onChange={this.onAddressChanged}
            disabled={loading}
          />
          <Typography className={ classes.createAccount }>
            <Link style={{color : '#000'}} href={url} target="_blank" rel="noreferrer">
              Don't have a wallet? create one
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={ 12 } align='right' className={ classes.button }>
          <Button
            fullWidth
            label="Next"
            loading={loading}
            onClick={this.onNext}
          />
        </Grid>
        <Link className={classes.belLink} href="BBDXBridgeTOS.html" target="_blank">Terms of Service</Link>
        
        {
          this.state.loginOpen &&
          <LoginPopup open={this.state.loginOpen} loginClose={this.loginClose} />
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

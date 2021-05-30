import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazy-load';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';
import { store, dispatcher, Actions, Events } from '@store';
import { Snackbar, Swap, ImageLoader } from '@components';
import theme from '@theme';

export default class App extends PureComponent {
  state = {
    snackbar: {
      message: null,
      variant: 'success',
      open: false,
      balance: ""
    }
  }

  componentDidMount = () => {
    store.on(Events.FETCHED_BALANCE, this.onBalUpdated);
  }

  componentWillMount() {
    dispatcher.dispatch({
      type: Actions.GET_BALANCE
    });
  }

  onBalUpdated = () => {
    this.setState({ balance: store.getStore('balance') || {} });
  }

  showMessage = (message, variant) => {
    const snackbar = {
      message,
      variant: variant || 'error',
      open: true
    };
    this.setState({ snackbar });
  }

  closeMessage = (event, reason) => {
    if (reason === 'clickaway') return;
    const snackbar = {
      ...this.state.snackbar,
      open: false
    };
    this.setState({ snackbar });
  }

  renderSnackbar = () => {
    const { snackbar } = this.state;
    return <Snackbar message={snackbar.message} open={snackbar.open} onClose={this.closeMessage} variant={snackbar.variant} />;
  }

  renderBackgroundImage = () => {
    return (
      <div id="background">
        <LazyLoad height={'100%'}>
          <ImageLoader className="backgroundImage" loadedClassName="backgroundImageLoaded" src="/images/background.jpg" alt="Background" />
        </LazyLoad>
      </div>
    );
  }

  renderTitleImage = () => {
    return (
      <Box display="flex" justifyContent="center" className="title">
        <LazyLoad height={'60px'} className="titleContainer">
          <ImageLoader className="titleImage" loadedClassName="titleImageLoaded" src="/images/logo.png" alt="Logo" />
        </LazyLoad>
        {/* <div className="moving">

        </div> */}
      </Box>
    );
  }

  render() {
    let bal = 0, total = 0
    if (this.state.balance && this.state.balance.length > 0) {
      bal = Number(parseFloat(this.state.balance[0].movedBalance).toFixed(2)).toLocaleString('en', {
        minimumFractionDigits: 2
      });
      total = Number(parseFloat(this.state.balance[0].totalSupply).toFixed(2)).toLocaleString('en', {
        minimumFractionDigits: 2
      })
    }
    return (
      <MuiThemeProvider theme={createMuiTheme(theme)}>
        <CssBaseline />
        {this.renderBackgroundImage()}
        <div id="content">
          {this.renderTitleImage()}
          <div className="movedBal">
            <p>Total bdx moved to Binance smart chain</p>
            <p className="movedBal-p2">{bal} <span className="availBal">/ {total}</span></p>
          </div>
          <Grid
            id="grid"
            container
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Swap showMessage={this.showMessage} movedBalance={bal} totalSupply={total}/>
              {this.renderSnackbar()}
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

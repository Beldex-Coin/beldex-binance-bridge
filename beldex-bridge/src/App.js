import React, { PureComponent } from "react";
import LazyLoad from "react-lazy-load";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Grid, Box, Typography } from "@material-ui/core";
import { store, dispatcher, Actions, Events } from "@store";
import { Snackbar, Swap, ImageLoader } from "@components";
import theme from "@theme";

export default class App extends PureComponent {
  state = {
    snackbar: {
      message: null,
      variant: "success",
      open: false,
      balance: "",
    },
  };

  componentDidMount = () => {
    store.on(Events.FETCHED_BALANCE, this.onBalUpdated);
  };

  componentWillMount() {
    dispatcher.dispatch({
      type: Actions.GET_BALANCE,
    });
  }

  onBalUpdated = () => {
    this.setState({ balance: store.getStore("balance") || {} });
  };

  showMessage = (message, variant) => {
    const snackbar = {
      message,
      variant: variant || "error",
      open: true,
    };
    this.setState({ snackbar });
  };

  closeMessage = (event, reason) => {
    if (reason === "clickaway") return;
    const snackbar = {
      ...this.state.snackbar,
      open: false,
    };
    this.setState({ snackbar });
  };

  renderSnackbar = () => {
    const { snackbar } = this.state;
    return (
      <Snackbar
        message={snackbar.message}
        open={snackbar.open}
        // open={true}

        onClose={this.closeMessage}
        variant={snackbar.variant}
      />
    );
  };

  renderBackgroundImage = () => {
    return (
      <div id="background">
        <LazyLoad height={"100%"}>
          <ImageLoader
            className="backgroundImage"
            loadedClassName="backgroundImageLoaded"
            src="/images/background.png"
            alt="Background"
          />
        </LazyLoad>
      </div>
    );
  };

  renderTitleImage = () => {
    return (
      <Box style={{width:'100%',margin:'30px'}}
        display="flex"
        className="title"
        justifyContent="flexStart"
        alignSelf="baseline"
      >
        <LazyLoad height={"60px"} className="titleContainer" >
          <ImageLoader
            className="titleImage"
            loadedClassName="titleImageLoaded"
            src="/images/logo.png"
            alt="Logo"
          />
        </LazyLoad>
        {/* <div className="moving">

        </div> */}
      </Box>
    );
  };

  render() {
    let bal = 0,
      total = 0;
    if (this.state.balance && this.state.balance.length > 0) {
      bal = Number(
        parseFloat(this.state.balance[0].movedBalance).toFixed(2)
      ).toLocaleString("en", {
        minimumFractionDigits: 2,
      });
      total = Number(
        parseFloat(this.state.balance[0].totalSupply).toFixed(2)
      ).toLocaleString("en", {
        minimumFractionDigits: 2,
      });
    }
    return (
      <MuiThemeProvider theme={createMuiTheme(theme)}>
        <CssBaseline />
        {this.renderBackgroundImage()}
        <div id="content">
          {this.renderTitleImage()}
          {/* <div className="movedBal">
            <p>Total bdx moved to Binance smart chain</p>
            <p className="movedBal-p2">
              {bal} <span className="availBal">/ {total}</span>
            </p>
          </div> */}
          <div className="d-flex-center">
            {/* <Grid id="grid" container spacing={2}>
              <Grid xs={12} md={5}>
                <p className="appName">
                  <span className="beldexName">Beldex</span> Bridge
                </p>
                <p className="app-left-content">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus.
                </p>
              </Grid>  */}
              {/* <Grid id="grid" container  xs={12} > */}

                {/* <div className="rightPane-wrapper"> */}
                {/* <div className="movedBal">
                  <p className="bal-title">Total <span style={{color:'rgba(0, 173, 7, 0.93)'}}>BDX</span> moved to Binance smart chain</p>
                  <p className="movedBal-p2">
                    {bal} <span className="availBal">/ {total}</span>
                  </p>
                </div> */}
                <Swap
                  showMessage={this.showMessage}
                  movedBalance={bal}
                  totalSupply={total}
                />
                {this.renderSnackbar()}
                {/* </div> */}
              {/* </Grid> */}

            {/* </Grid> */}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

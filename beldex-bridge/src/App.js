import React, { PureComponent } from "react";
import LazyLoad from "react-lazy-load";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Popover,
  Typography,
  Avatar,
  Button as MuiButton,
} from "@material-ui/core";
import { store, dispatcher, Actions, Events } from "@store";
import { Snackbar, Swap, ImageLoader } from "@components";
import theme from "@theme";
import binance from "./components/popup/binance.png";
import metamask from "./components/popup/metamask.png";
export default class App extends PureComponent {
  state = {
    snackbar: {
      message: null,
      variant: "success",
      open: false,
      balance: "",
      anchorEl: null,
    },
    connectedWalletInfo: {},
  };

  componentDidMount = () => {
    store.on(Events.FETCHED_BALANCE, this.onBalUpdated);
    store.on(Events.CONNECTED_WALLET_INFO, this.onConnectedWalletInfoUpdated);
  };

  componentWillMount() {
    dispatcher.dispatch({
      type: Actions.GET_BALANCE,
    });
  }

  onBalUpdated = () => {
    console.log("walletAddress data1", store);

    this.setState({ balance: store.getStore("balance") || {} });
  };
  onConnectedWalletInfoUpdated = () => {
    this.setState({
      connectedWalletInfo: store.getStore("connectedWalletInfo") || {},
    });
  };

  connectWallet = () => {
    dispatcher.dispatch({
      type: Actions.POPUP_OPEN,
      content: true,
    });
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
  handleClick = (event) => {
    
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  disconnectWallet = () => {
    dispatcher.dispatch({
      type: Actions.CONNECTED_WALLET_INFO,
      content: { name: "", address: "", balance: "" },
    });
    this.handleClose();
  };

  addressTruncateFn = (str) => {
    if (str && str.length > 30) {
      return str.substr(0, 7) + "..." + str.substr(str.length - 5, str.length);
    }
    return str;
  };
  renderSnackbar = () => {
    const { snackbar } = this.state;
    return (
      <Snackbar
        message={snackbar.message}
        // message={'Please add the Binance smart chain to your wallet.'}
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
    const { connectedWalletInfo } = this.state;
    const id = Boolean(this.state.anchorEl) ? 'menu-appbar' : undefined;
    return (
      <Box
        display="flex"
        className="title"
        justifyContent="space-between"
        alignSelf="baseline"
        // style={{height:'300px'}}
      >
        <LazyLoad className="titleContainer">
          <ImageLoader
            className="titleImage"
            loadedClassName="titleImageLoaded"
            src="/images/logo.png"
            alt="Logo"
          />
        </LazyLoad>
        <div className="header" >
          {connectedWalletInfo.address ? (
            <button className="connectButton " style={{color:'white'}} onClick={this.handleClick}>
              {this.addressTruncateFn(connectedWalletInfo.address)}
            </button>
          ) : (
            <button className="connectButton" onClick={this.connectWallet}>
              Connect Wallet
            </button>
          )}
          <Popover
            id={id}
            open={Boolean(this.state.anchorEl)}
            anchorEl={this.state.anchorElWallet}
            onClose={this.handleClose}
            
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            style={{
              "& .MuiPopover-paper":{
                top:'20px !important'
              }
            }}
          >
            <Box
              style={{
                padding: "20px",
                background: "rgb(41,41,57)",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box style={{ display: "flex", gap: "10px" }}>
                  <Avatar
                    style={{ width: 24, height: 24 }}
                    src={
                      connectedWalletInfo.name === "Binance"
                        ? binance
                        : metamask
                    }
                  />
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      color: "#fff",
                    }}
                    textAlign="center"
                  >
                    {this.addressTruncateFn(connectedWalletInfo.address)}
                  </Typography>
                </Box>
                <MuiButton
                  variant="outlined"
                  style={{
                    color: "rgb(152, 152, 177)",
                    border: "solid 1px rgb(58,58,80)",
                    background: "rgb(41,41,57)",
                    borderRadius: "10px",
                    "&:hover": {
                      border: "solid 1px #fff",
                      background: "rgb(41,41,57)",
                      color: "#fff",
                    },
                  }}
                  onClick={() => this.disconnectWallet()}
                >
                  Disconnect
                </MuiButton>
              </Box>
              <Box>
                <Typography
                  color="primary"
                  style={{ fontWeight: 600, fontSize: "15px" }}
                >
                  Balance
                </Typography>
                <Typography
                  component="div"
                  color="text.light"
                  style={{
                    fontWeight: 900,
                    fontSize: "28px",
                    lineHeight: "1",
                    paddingTop: "5px",
                  }}
                >
                  {connectedWalletInfo.balance}
                </Typography>
              </Box>
            </Box>
          </Popover>
        </div>
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
          <div className="d-flex-center">
            <Swap
              showMessage={this.showMessage}
              movedBalance={bal}
              totalSupply={total}
            />
            {this.renderSnackbar()}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

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
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
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
    // console.log("walletAddress data1", store);

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

  mobileCheck() {
    let check = false;

    if (
      typeof navigator !== "undefined" &&
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      check = true;
    }

    return check;
  }
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
    const id = Boolean(this.state.anchorEl) ? "menu-appbar" : undefined;
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
        <div className="header">
          {connectedWalletInfo.addressc&& !this.mobileCheck ? (
            <button
              className="connectButton "
              style={{ color: "white", display: "flex", alignItems: "center" }}
              onClick={this.handleClick}
            >
              <Avatar
                style={{ width: 24, height: 24, marginLeft: "10px" }}
                src={
                  connectedWalletInfo.name === "Binance" ? binance : metamask
                }
              />
              <i style={{ marginLeft: "5px" }}>
                {this.addressTruncateFn(connectedWalletInfo.address)}
              </i>
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
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box
              style={{
                padding: "20px",
                background: "rgb(41,41,57)",
                alignItems: "center",
              }}
            >
              <Box display="flex" justifyContent="end" alignSelf="baseline">
                <i
                  onClick={this.handleClose}
                  style={{
                    width: "25px",
                    height: "25px",
                    backgroundColor: "#404057",
                    borderRadius: "20px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <ClearRoundedIcon style={{ fontSize: 16 }} />
                </i>
              </Box>
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
                      fontSize: "1rem",
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
                    border: " 1.724px solid #404057",
                    background: "rgb(41,41,57)",
                    borderRadius: "10px",
                    color: "#9898B1",
                    fontWeight: 600,
                    "&:hover": {
                      border: "solid 1px #fff",
                      background: "rgb(41,41,57)",
                      color: "#fff",
                    },
                  }}
                  onClick={() => this.disconnectWallet()}
                >
                  Disconnect{" "}
                  <i
                    style={{
                      marginLeft: "5px",
                      marginTop: "7px",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="disconnect">
                        <g id="surface2380">
                          <path
                            id="Vector"
                            d="M6.17383 8.0473H12.9637"
                            stroke="#CB492D"
                            stroke-width="1.72441"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            id="Vector_2"
                            d="M11.6705 6.10736L13.6105 8.04732L11.6705 9.98728"
                            stroke="#CB492D"
                            stroke-width="1.72441"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            id="Vector_3"
                            d="M11.8339 3.84405C10.7864 2.83197 9.36343 2.22742 7.79058 2.22742C4.57584 2.22742 1.9707 4.83255 1.9707 8.0473C1.9707 11.262 4.57584 13.8672 7.79058 13.8672C9.35165 13.8672 10.7864 13.2508 11.8322 12.2505"
                            stroke="#CB492D"
                            stroke-width="1.72441"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                      </g>
                    </svg>
                  </i>
                </MuiButton>
              </Box>
              <Box>
                <Typography
                  // color="primary"
                  style={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#3EC744",
                  }}
                >
                  Balance
                </Typography>
                <Typography
                  component="div"
                  color="text.light"
                  style={{
                    fontWeight: 900,
                    fontSize: "1.3rem",
                    lineHeight: "1",
                    paddingTop: "5px",
                  }}
                >
                  {connectedWalletInfo.balance}{" "}
                  <span style={{ fontSize: "1rem" }}>WBDX</span>
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

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    backgroundColor: "#1C1C26",
    borderRadius: "10px",
    maxWidth: "unset",
  },
  tabsWrapper: {
    display: "flex",
    flexGrow: 1,
    borderRadius: "18px",
    border: "1px solid #393954",
    background: "#1F1F2E",
    padding: "5px",
    maxWidth: "unset",
    marginTop: "15px",

    "& .MuiTab-textColorInherit": {
      background: "#1F1F2E",
      width: "50%",
      height: "45px",
      fontWeight: 500,
      margin: "0px",
      fontSize: "1rem",
      maxWidth: "unset",
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.7rem",
      },
    },
    "& .Mui-selected": {
      borderRadius: "12px",
      background: "#282837",
      opacity: 1,
    },
  },
  greenDots: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    backgroundColor: "#00AD07",
    borderRadius: "20px",
  },
}));

export default function SwapTabs(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  async function handleChange(e, newValue) {
    mobileCheck();
    setValue(newValue);
    let value = "";
    if (newValue === 0) {
      value = "bdx_to_bbdx";
      props.handleChange(value);
    }
    if (newValue === 1) {
      value = "bbdx_to_bdx";
      props.handleChange(value);
      if (mobileCheck) {
        if (
          typeof navigator !== "undefined" &&
          /MetaMaskMobile/i.test(navigator.userAgent)
        ) {
          const account = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (account) props.connectToMetaMask();
        } else {
          const dappUrl = window.location.href.split("//")[1].split("/")[0];
          const metamaskAppDeepLink =
            "https://metamask.app.link/dapp/" + dappUrl;
          window.open(metamaskAppDeepLink, "_self");
        }
      }
      // if (window.innerWidth < 720) {
      //   const account = await window.ethereum.request({
      //     method: "eth_requestAccounts",
      //   });
      //   if (account) props.connectToMetaMask();
      // } else {
      // }
    }
  }
  const mobileCheck = () => {
    let check = false;

    if (
      typeof navigator !== "undefined" &&
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      alert(navigator.userAgent);
      check = true;
    }
    return check;
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          className={classes.tabsWrapper}
        >
          <Tab
            label={
              <span>
                {" "}
                {value === 0 && (
                  <span className={classes.greenDots}></span>
                )}{" "}
                {t("bdxTowBDX")}
              </span>
            }
          />
          <Tab
            label={
              <span>
                {" "}
                {value === 1 && (
                  <span className={classes.greenDots}></span>
                )}{" "}
                {t("wBDXToBDX")}
              </span>
            }
          />
        </Tabs>
      </AppBar>
    </div>
  );
}

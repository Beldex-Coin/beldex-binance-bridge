import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import binance from "./binance.png";
import metamask from "./metamask.png";
import trustWallet from "./trustWallet.png"
import styles from "./styles";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from 'react-i18next';


function Popup(props) {
  const { onClose, selectedValue, open, classes } = props;
  const { t } = useTranslation();

  const [wallets, setWallet] = useState([
    { text: "Binance", img: binance },
    { text: "Metamask", img: metamask },
  ]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };
  function mobileCheck() {
    let check = false;
    if (
      typeof navigator !== "undefined" &&
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      check = true;
    }
    //  console.log('check ::',check)
    return check;
  }
  const handleResize = () => {
    if (mobileCheck() || window.innerWidth<400) {
      setWallet([
        { text: "Trust Wallet", img:trustWallet },
        { text: "Metamask", img: metamask },
      ]);
    } else {
      setWallet([
        { text: "Binance", img: binance },
        { text: "Metamask", img: metamask },
      ]);
    }
  };
  // create an event listener
  useEffect(() => {
    handleResize();
    // window.addEventListener("resize", handleResize);
  }, []);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle className={classes.title} id="simple-dialog-title">
        {t('chooseWallet')}
        <Button
          onClick={handleClose}
         className={classes.closeBtn}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <List className={classes.root}>
        {wallets.map((wallet) => (
          <ListItem
            onClick={() => handleListItemClick(wallet.text)}
            key={wallet.text}
          >
            <div className={classes.wallet}>
              <ListItemAvatar>
                <Avatar src={wallet.img}  />
              </ListItemAvatar>
              <ListItemText disableTypography primary={wallet.text} />
            </div>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default withStyles(styles)(Popup);

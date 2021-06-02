import React, {useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import binance  from './binance.png';
import metamask  from './metamask.png';
import styles from './styles';

// let wallets = [{text:'Binance', img: binance}, {text:'Metamask', img: metamask}];



function Popup(props) {
    const { onClose, selectedValue, open, classes } = props;

    const [wallets, setWallet] = useState([{text:'Binance', img: binance}, {text:'Metamask', img: metamask}]);

  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleListItemClick = (value) => {
      onClose(value);
    };
    const handleResize = () => {
      if (window.innerWidth < 720) {
          setWallet([{text:'Trust Wallet', img: binance}, {text:'Metamask', img: metamask}])
          console.log('mobile')
      } else {
        setWallet([{text:'Binance', img: binance}, {text:'Metamask', img: metamask}])
          console.log('web')
      }
    }
    // create an event listener
    useEffect(() => {
      window.addEventListener("resize", handleResize)
    }, []);
  
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle className={classes.title} id="simple-dialog-title">Choose Wallet account</DialogTitle>
        <List  className={classes.root}>
          {wallets.map((wallet) => (
            <ListItem button onClick={() => handleListItemClick(wallet.text)} key={wallet.text}>
              <ListItemAvatar>
                <Avatar  src={wallet.img} />
              </ListItemAvatar>
              <ListItemText disableTypography primary={wallet.text} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
  }

  export default withStyles(styles)(Popup);

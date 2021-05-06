import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: "3px 15px 10px" }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SwapTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(e, newValue) {
    setValue(newValue);
    console.log(newValue)
    let value = '';
    if(newValue === 0){
        value = "bdx_to_bbdx"
    }
    if(newValue === 1){
        value = 'bbdx_to_bdx'
    }
    props.handleChange(value);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="BDX to Binance BDX" />
          <Tab label="Binance BDX to BDX" />
        </Tabs>
      </AppBar>
      {value === 0 && <TabContainer>BDX to Binance BDX</TabContainer>}
      {value === 1 && <TabContainer>Binance BDX to BDX</TabContainer>}
    </div>
  );
}
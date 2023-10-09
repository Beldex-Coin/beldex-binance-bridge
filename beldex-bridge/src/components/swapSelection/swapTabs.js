import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#1C1C26",
    borderRadius: "10px",
  },
  tabsWrapper: {
    borderRadius: "18px",
    border: "1px solid #393954",
    background: "#1F1F2E",
    padding: '5px',

    "& .MuiTabs-flexContainer": {
      justifyContent: 'space-between',
    },

    "& .MuiTab-textColorInherit": {
      background: "#1F1F2E",
      width: "49%",
      height: "45px",
      fontWeight: 500,
      margin: '0px',
      fontSize: '1rem'
    },
    "& .Mui-selected": {
      borderRadius: "12px",
      background: "#282837",
      opacity: 1
    },
  },
  greenDots: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    backgroundColor: '#00AD07',
    borderRadius: '20px'
  }
}));

export default function SwapTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  async function handleChange(e, newValue) {
    setValue(newValue);
    let value = "";
    if (newValue === 0) {
      value = "bdx_to_bbdx";
      props.handleChange(value);
    }
    if (newValue === 1) {
      value = "bbdx_to_bdx";
      props.handleChange(value);
      if (window.innerWidth < 720) {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (account) props.connectToMetaMask();
      } else {
      }
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          className={classes.tabsWrapper}
        >
          <Tab label={<span> {value === 0 && <span className={classes.greenDots}></span>} BDX to wBDX</span>} />
          <Tab label={<span> {value === 1 && <span className={classes.greenDots}></span>} wBDX to BDX</span>} />
        </Tabs>
      </AppBar>
      {/* {value === 0 && <TabContainer>BDX to wBDX</TabContainer>}
      {value === 1 && <TabContainer>wBDX to BDX</TabContainer>} */}
    </div>
  );
}

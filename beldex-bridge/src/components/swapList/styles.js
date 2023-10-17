import { orange } from "@material-ui/core/colors";

const styles = (theme) => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  item: {
    padding: theme.spacing(1, 2),
    borderBottom: "0px solid #d4d4d4",
    background: "#282837",
    borderRadius: "10px",
   
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1, 1),
      
    },
  },
  pending: {
    color: "#AFAFBE",
    fontWeight: "600",
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
  },
  completed: {
    color: "#3EC745",
    fontWeight: "600",
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
  },
  statusImg: {
    width: "15px",
    [theme.breakpoints.down("sm")]: {
      width: "12px",
    },
  },
  time: {
    // fontSize: '1em',
    color: "#AFAFBE",
    fontWeight: "400",
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem !important",
    },
  },
  timeSeperator: {
    margin: "0 4px",
  },
  divider: {
    margin: "8px 0",
  },
  hashBox: {
    margin: "6px 0px",
    padding: "0px 6px",
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
  hashTitle: {
    color: "#AFAFBE",
    fontWeight: "600",
    fontSize: "1.1em",
    marginRight: "4px",
    margin: "8px 0px 5px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },
  TxDetails: {
    wordBreak: "break-word",
  },
  hashes: { width: "70%" },
  hash: {
    // fontStyle: 'italic',
    overflowWrap: "break-word",
    fontWeight: 300,
    "& .MuiTypography-colorPrimary": {
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.7rem !important",
      },
    },
  },

  txnStatusHeader: {
    padding: "8px",
    border: "1px #393954 solid",
    borderRadius: "8px",
    backgroundColor: "#242433",
  },
  emptyTxnWrapper: {
    width: "190px",
    textAlign: "center",
    margin: "auto",
    marginTop: "70px",
    [theme.breakpoints.down("sm")]: {
      width: "unset",
    },
  },
  amount: {
    fontSize: "1.25em",
    fontWeight: "600",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  emptyTitle: {
    padding: theme.spacing(1, 0),
    color: "#666",
  },
});

export default styles;

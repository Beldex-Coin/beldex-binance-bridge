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
  },
  pending: {
    color: "#AFAFBE",
    fontWeight: "600",
    fontSize: "14px",
  },
  completed: {
    color: "#3EC745",
    fontWeight: "600",
    fontSize: "14px",
  },
  statusImg: {
    width: "15px",
  },
  time: {
    // fontSize: '1em',
    color: "#AFAFBE",
    fontWeight: "400",
    fontSize: "14px",
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
  },
  hashTitle: {
    color: "#AFAFBE",
    fontWeight: "600",
    fontSize: "1.1em",
    marginRight: "4px",
    margin: "8px 0px 5px",
  },
  TxDetails: {
    wordBreak: "break-word",
  },
  hashes: { width: "70%" },
  hash: {
    // fontStyle: 'italic',
    overflowWrap: "break-word",
    fontWeight: 300,
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
    marginTop: "70px",
    [theme.breakpoints.down("sm")]: {
      width:'unset'
    }
  },
  amount: {
    fontSize: "1.25em",
    fontWeight: "600",
  },
  emptyTitle: {
    padding: theme.spacing(1, 0),
    color: "#666",
  },
});

export default styles;

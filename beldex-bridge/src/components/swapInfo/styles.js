import { red } from "@material-ui/core/colors";
import { common } from "@theme";

const styles = (theme) => ({
  root: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "800px",
      position: "sticky",
      top: 0,
    },
    ...common.section,
  },
  instructionContainer: {
    // ...common.flexCenter,
    flexDirection: "column",
    wordBreak: "break-word",
  },

  instructions: {
    color: "#EBEBEB",
    fontFamily: "Poppins",
    fontSize: "0.80rem",
    fontStyle: "normal",
    fontWeight: 300,
    lineHeight: "22px",
    wordBreak: "break-word",
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    }
    
  },
  instructionBold: {
    // color: '#fff',
    fontFamily: "Poppins",
    color: "#AFAFBE",
    fontSize: "1.1rem",
    fontWeight: "600",
    // textAlign: 'left',
    marginBottom: "5px",
    overflowWrap: "break-word",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
  },
  feeInfo: {
    marginTop: theme.spacing(1),
    color: "#AFAFBE",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.6rem",
    },
  },
  instructionWrapper: {
    marginTop: theme.spacing(2),
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #393954",
  },
  noteTitle: {
    fontWeight: 600,
    fontSize: "1.1rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  memoFrame: {
    marginBottom: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  memo: {
    border: "1px solid",
    borderColor: "#35af3b",
    borderRadius: "3px",
    backgroundColor: "#35af3b",
    color: "white",
    padding: "1rem",
    overflowWrap: "break-word",
    maxWidth: "100%",
    textAlign: "center",
  },
  warningText: {
    color: theme.palette.text.secondary,
    margin: theme.spacing(1, 0),
    textAlign: "center",
  },
  link: {
    cursor: "pointer",
  },
  qr: {
    padding: theme.spacing(1),
    backgroundColor: "white",
    borderRadius: "16px",
  },
  qrContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#1C1C26",
    borderRadius: "16px",
    // width: '271px',
    padding: "20px",
    margin: "auto",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  red: {
    color: red[500],
  },
  addressWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  },
  greenBorder: {
    width: "77%",
    // borderRadius: '4px',
    border: "none",
    // background: '#4a4a63',
    // padding: "10px",
    color: "#EBEBEB",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
      width: "90%",
    },
  },
  wbdxAddressTitle: {
    color: "#AFAFBE",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "0.80rem",
    fontStyle: "normal",
    fontWeight: 300,
    wordBreak: "break-all",
  },
  // wbdxAddress: {
  //   wordBreak: "break-all",
  //   wbdxAddressTitle,
  //   color: "#EBEBEB",
  //   textAlign: "center",
  //   fontFamily: "Poppins",
  //   fontSize: "16px",
  //   fontStyle: "normal",
  //   fontWeight: 300,
  // },
  walletConWrapper: {
    borderRadius: "12px",
    background: "#282837",
    width: "100%",
    height: "70px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      height: "45px",
    },
  },
  walletConnSucc: {
    // color: "#35af3b !important",
    // textAlign: "center",
    // marginBottom: "10px",
    color: "#3EC745 !important",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },
  walletConnErr: {
    color: "red !important",
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "10px",
  },
});

export default styles;

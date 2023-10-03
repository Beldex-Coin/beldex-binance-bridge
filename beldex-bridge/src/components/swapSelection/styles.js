import { common } from "@theme";

const styles = (theme) => ({
  root: {
    width: "100%",
    margin:'auto',
    marginTop: "20px",
    backgroundColor: "#1C1C26 !important",
    // padding: '1.5rem',
    // boxShadow: "0px 0px 30px rgb(36 36 36)",
    color: "#000",
    border: "1px solid #f00",
    // position: "relative",
    borderRadius: "10px !important",

    // paddingTop: "90px",
    [theme.breakpoints.up("md")]: {
      maxWidth: "500px",
    },
    ...common.section,
  },
  button: {
    marginTop: "24px",
    "& .Mui-disabled": {
      borderRadius: "50px",
      border: "1px solid #00AD07",
      background: "#242433",
    },
  },
  createAccount: {
    fontSize: "0.8rem",
    // textDecoration: "underline",
    textAlign: "center",
    marginBottom: "0px",
    cursor: "pointer",
    display: "inline-block",
    color: "#fff",
    width: "100%",
  },
  belLink: {
    display: "inline-block",
    textAlign: "center",
    width: "100%",
    marginTop: "20px",
    color: "#000",
    fontSize: "14px",
  },
  closeBtn: {
    position: "absolute",
    top: "5px",
    right: 0,
    background: "transparent !important",
  },
  belSelect: {
    color: "#000",
  },
  swapTabs: {
    // position: "absolute",
    width: "100%",
    left: "0px",
    top: "0px",
    zIndex: "9",
  },
  swapFee: {
    fontSize: "12px",
    // position: "absolute",
    // right: "15px",

    // zIndex: "9",
    textAlign: "end",
    color: "#AFAFBE",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
  },
  wbdxAddressTitle: {
    color: "#AFAFBE",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 300,
    wordBreak: "break-all",
  },
  wbdxAddress: {
    wordBreak: "break-all",
    color: "#EBEBEB;",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 300,
  },
});

export default styles;

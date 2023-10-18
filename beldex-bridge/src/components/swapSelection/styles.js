import { common } from "@theme";

const styles = (theme) => ({
  root: {
    width: "100%",
    margin: "auto",
    backgroundColor: "#1C1C26 !important",
    color: "#000",
    border: "1px solid #f00",
    borderRadius: "10px !important",
    ...common.section,
  },
  button: {
    "& .Mui-disabled": {
      borderRadius: "50px",
      border: "1px solid #00AD07",
      background: "#242433",
    },
  },
  createAccount: {
    fontSize: "0.8rem",
    textAlign: "center",
    marginBottom: "0px",
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
  viewLink: {
    color: "#2FA6FF",
    textDecoration: "underline",
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
    width: "100%",
    left: "0px",
    top: "0px",
    zIndex: "9",
  },
  swapFee: {
    marginTop: "5px",
    fontSize: "12px",
    textAlign: "end",
    color: "#AFAFBE",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 400,
  },
  amountError: {
    color: "red",
    fontSize: "12px",
  },
  wbdxAddressTitle: {
    color: "#AFAFBE",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 300,
    wordBreak: "break-all",
  },
  wbdxAddress: {
    wordBreak: "break-all",
    color: "#EBEBEB;",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: 300,
  },
});

export default styles;

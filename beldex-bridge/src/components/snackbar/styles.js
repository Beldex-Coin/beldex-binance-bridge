
import { colors } from "@theme";

const styles = (theme) => ({
  success: {
    backgroundColor: '#13131B',
    border: "1px solid #3CBC43",
    borderRadius: "15px",
  },
  error: {
    backgroundColor: '#13131B',
    border: "1px solid #DC4040",
    borderRadius: "15px",
    height:'60px'
  },
  info: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "15px",
  },
  warning: {
    backgroundColor: '#13131B',
    border: "1px solid #FFBC00",
    borderRadius: "15px",
  },
  icon: {
    width:'17px'
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
    marginTop: "0px",
  },
  contentWrapper:{
    '& .MuiSnackbarContent-message':{
      width:'90%'
    }
   
  },
  closeIcon: {
    position: "absolute",
    top: '-46px',
    right: '-22px',
    backgroundColor: "#13131B",
    borderRadius: "20px",
    width: "26px",
    height: "26px",
    display: "flex",
    '&:hover': {
      backgroundColor: '#494969',
    },
  },
  message: {
    display: "flex",
    alignItems: "center",
    // width:'90%'
  },

  primaryText: {
    color: theme.palette.text.primary,
  },
  blackText: {
    color: colors.belBlack,
  },
});

export default styles;

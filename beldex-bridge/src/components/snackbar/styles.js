import { amber, green } from "@material-ui/core/colors";
import { colors } from "@theme";

const styles = (theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
    marginTop: "0px",
  },
  closeIcon: {
    position: "relative",
    top: "-22px",
    right: "-31px",
    // backgroundColor: "#282837",
    borderRadius: "20px",
    border: "2px solid white",
    width: "26px",
    height: "26px",
    display: "flex",
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
  primaryText: {
    color: theme.palette.text.primary,
  },
  blackText: {
    color: colors.belBlack,
  },
});

export default styles;

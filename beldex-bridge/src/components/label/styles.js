const styles = (theme) => ({
  inline: {
    verticalAlign: "middle",
    display: "inline-block",
    width: "calc(100% - 50px)",
    color: "#AFAFBE",
    fontFamily:'poppins',
    fontSize: '1rem',
    fontWeight: 400,
    [theme.breakpoints.down("sm")]: {
     fontSize:'0.7rem'
    },
  },
});

export default styles;

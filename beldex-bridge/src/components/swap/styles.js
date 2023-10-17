import { common } from "@theme";

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "40px",
    },
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
    overflow: "auto",
    height: "448px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10px",
      overflow: "unset",
      height: "unset",
    },
  },
  itemColumn: {
    display: "flex",
    flexDirection: "column",
  },
  spaceBetweenRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txHeader: {
    backgroundColor: "#2E2E44",
    borderRadius: "10px",
    padding: "7px",
  },
  statTitle: {
    marginRight: "4px",
    fontSize: "0.84rem",
    color: "#AFAFBE",
    fontWeight: "600",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },
  },
  statAmount: {
    color: "#EBEBEB",
    fontWeight: "600",
    fontSize: "0.94rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.84rem",
    },
  },
  transactionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },
  hash: {
    fontSize: "14px",
  },
  section: {
    ...common.section,
    height: "447px",
    padding: "10px",
    [theme.breakpoints.up("md")]: {
      maxWidth: "800px",
      margin: "auto",
    },
  },
  sectionSwap: {
    ...common.section,
    height: "447px",
    // display:'flex',
    // alignItems:'center',
    overflowX: "hidden",
    padding: "10px",
    [theme.breakpoints.up("md")]: {
      // maxWidth: "800px",
      // margin: "auto",
      maxWidth:'unset',
      margin: "unset",
    },
    
    [theme.breakpoints.down("sm")]: {
      padding:0
    },
  },
  registerWrapper: {
    // width: '100%',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItem: 'center',
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   flexWrap: "wrap",
    // },
    // [theme.breakpoints.down('sm')]: {
    //   flexWrap: "wrap",
    // }
  },
  backBox: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.90rem",
    marginBottom: "10px",
    cursor:'pointer',
    width:'76px',
    // '&:hover':{
    //   opacity:'0.8'
    // }
    // '& svg':{
    //   '&:hover':{
    //     fill:'#fff',
    //     color:'#fff'
    //   }
    // }

  },
  backImg: {
    // width: "17px",
    fill:"#AFAFBE",
    marginRight: "5px",
    '&:hover':{
      fill:'#fff',
      color:'#fff'
    }
  },
  backTxt: {
    fontWeight: "500",
    fontSize: "1.1rem",
    // '&:hover':{
    //   opacity:'0.8'
    // }
  },
  balanceBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dashBoard: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItem: "center",
    // padding: "22px",
    padding: '15px 22px',
    border: "0.5px #56566C solid",
    backgroundColor: "#1C1C26",
    borderRadius: "20px",
    // marginTop: "15px",
    [theme.breakpoints.down("sm")]: {
      border: "unset",
      padding: "unset",
      paddingTop: "15px",
    },
  },
  // dashBoard: {
  //   width: "100%",
  //   height: "100%",
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   alignItem: "center",
  //   padding: "22px",
  //   border: "0.5px #56566C solid",
  //   backgroundColor: "#1C1C26",
  //   borderRadius: "20px",
  //   marginTop: "15px",
  // },
  leftPane: {
    // width: '70%',
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
    // [theme.breakpoints.between('xs', 'sm')]: {
    //   width:'95%',
    //   margin:'auto'
    // },
  },
  rightPaneWrapper: {
    width: "70%",
    height: '615px',
    padding: "25px 20px",
    marginLeft: "auto",
    borderRadius: "30px",
    border: "0.5px solid #56566c",
    background: "#1c1c26",
    boxShadow: "0px 6px 94px 0px rgba(0, 0, 0, 0.2)",
    [theme.breakpoints.between("xs", "sm")]: {
      width: "91%",
      height: 'unset',
      margin: "auto",
      padding: "10px",
    },
  },
  swapList: {
    borderRadius: "10px",
    border: "1px #393954 solid",
  },
  scroll: {
    overflowX: "hidden",
  },
  bottomSpacing: {
    [theme.breakpoints.between("xs", "sm")]: {
      height: "70px",
      width: "100%",
    },
  },
});

export default styles;

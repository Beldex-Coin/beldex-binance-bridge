import { common } from '@theme';

const styles = theme => ({
  root: {
    backgroundColor: '#fff !important',
    // boxShadow: "0px 0px 30px rgb(36 36 36)",
    border: 'none !important',
    color: '#000',
    position: 'relative',
    paddingTop: '90px',
    [theme.breakpoints.up('md')]: {
      maxWidth: '500px',
    },
    ...common.section,
  },
  button: {
    marginTop: '24px'
  },
  createAccount: {
    fontSize: '0.8rem',
    textDecoration: 'underline',
    textAlign: 'center',
    marginBottom: '0px',
    cursor: 'pointer',
    display: 'inline-block',
    color: '#fff',
    width: '100%',
  },
  belLink: {
    display: 'inline-block',
    textAlign: 'center',
    width: '100%',
    marginTop: '20px',
    color: "#000",
    fontSize: '14px'
  },
  closeBtn: {
    position: 'absolute',
    top: '5px',
    right: 0,
    background: 'transparent !important'
  },
  belSelect: {
    color: "#000"
  },
  swapTabs: {
    position: 'absolute',
    width: '100%',
    left: '0px',
    top: '0px',
    zIndex: '9',
  },
  swapFee: {
    fontSize: '12px',
    position: 'absolute',
    right: '15px',
    top: '60px',
    zIndex: '9',
  }
});

export default styles;

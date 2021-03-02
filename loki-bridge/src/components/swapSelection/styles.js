import { common } from '@theme';

const styles = theme => ({
  root: {
    backgroundColor: '#060f00 !important',
    boxShadow: "0px 0px 30px rgb(36 36 36)",
    border: '1px solid #282828',
    [theme.breakpoints.up('md')]: {
      maxWidth: '600px',
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
    color: "#fff"
  }
});

export default styles;

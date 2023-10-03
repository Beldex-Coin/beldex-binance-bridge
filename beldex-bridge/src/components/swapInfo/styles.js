import { red } from '@material-ui/core/colors';
import { common } from '@theme';

const styles = theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      maxWidth: '800px',
      position: 'sticky',
      top: 0,
    },
    ...common.section,
  },
  instructionContainer: {
    ...common.flexCenter,
    flexDirection: 'column',
    wordBreak: 'break-word',
  },
  
  instructions: {
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px',
    color: "#fff",
    wordBreak: 'break-word'
  },
  instructionBold: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '16px',
    overflowWrap: 'break-word',
  },
  memoFrame: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  memo: {
    border: '1px solid',
    borderColor: '#35af3b',
    borderRadius: '3px',
    backgroundColor: '#35af3b',
    color: 'white',
    padding: '1rem',
    overflowWrap: 'break-word',
    maxWidth: '100%',
    textAlign: 'center'
  },
  warningText: {
    color: theme.palette.text.secondary,
    margin: theme.spacing(1, 0),
    textAlign: 'center',
  },
  link: {
    cursor: 'pointer'
  },
  qr: {
    padding: theme.spacing(1),
    backgroundColor: 'white',
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  red: {
    color: red[500]
  },
  greenBorder: {
    borderWidth: 1,
    borderColor: "transparent",
    borderStyle: 'solid',
    borderRadius: '4px',
    border: 'none',
    background: '#4a4a63',
    padding: '10px'
  },
  walletConnSucc:{
    color: "#35af3b !important",
    textAlign: "center",
    marginBottom: "10px"
  },
  walletConnErr:{
    color: "red !important",
    textAlign: "center",
    fontSize:'14px',
    marginBottom: "10px"
  }
});

export default styles;

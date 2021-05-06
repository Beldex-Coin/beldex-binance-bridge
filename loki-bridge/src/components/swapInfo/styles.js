import { red } from '@material-ui/core/colors';
import { colors, common } from '@theme';

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
    color: "#000"
  },
  instructionBold: {
    color: '#000',
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
    borderColor: colors.beldexBlack90,
    borderRadius: '3px',
    backgroundColor: colors.beldexBlack90,
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
    borderColor: "#000",
    borderStyle: 'solid',
    padding: theme.spacing(1),
    borderRadius: '4px'
  }
});

export default styles;

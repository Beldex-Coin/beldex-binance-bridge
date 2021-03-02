import color from '@material-ui/core/colors/amber';
import colors from './colors';

const theme =  {
  typography: {
    fontFamily: ['Lato', 'Roboto', 'Open Sans', 'sans-serif'].join(','),
    lineHeight: 1.45,
    useNextVariants: true,
    h6: {
      fontFamily: ['Source Sans Pro','sans-serif'].join(','),
      fontSize: '0.8rem',
      fontWeight: 600,
      marginBottom: '.5rem'
    }
  },
  type: 'light',
  overrides: {
    MuiInputBase: {
      root: {
        fontSize: '13px',
        background: colors.belColorWhite,
        border: '1px solid #d4d4d4',
        color: '#000',
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '14px',
        background: 'transparent'
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
        borderRadius: '0px'
      }
    },
    MuiButton: {
      label: {
        fontSize: '0.7rem'
      }
    },
    MuiDialogTitle: {
      root: {
        color: "#000"
      }
    },
    MuiTypography: {
      colorTextSecondary: {
        color: "#000"
      },
      colorPrimary: {
        color: '#000'
      },
      body1:
      {
        color: '#000'
      }
    },
    MuiSelect:{
      root: {
        color: '#000'
      },
      icon: {
        color: "000"
      }
    },
    MuiIconButton: {
      root:
      {
        color: '#000'
      }
    }
  },
  
  palette: {
    type: 'dark',
    primary: {
      main: colors.beldxGreen
    },
    secondary: {
      main: colors.lightBlack
    },
    background:{
      paper: colors.beldexBlack80,
      default: '#008522'
    },
    text: {
      primary: colors.gray,
      secondary: colors.beldxGreen
    }
  }
};

export default theme;

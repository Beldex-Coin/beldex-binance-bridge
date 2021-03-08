import colors from './colors';

const theme =  {
  typography: {
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.45,
    useNextVariants: true,
    fontSize: '14px',
    h6: {
      fontFamily: "'Poppins', sans-serif",
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
        fontSize: '14px'
      }
    },
    MuiDialogTitle: {
      root: {
        color: "#000"
      }
    },
    MuiTypography: {
      fontSize: '14px',
      colorTextSecondary: {
        color: "#000"
      },
      colorPrimary: {
        color: '#000',
        fontSize: '14px',
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
    },
    MuiTabs: {
      indicator: {
        backgroundColor: "transparent",
      }
    },
    MuiAppBar: {
      colorPrimary:{
        boxShadow: 'none',
        border: 0,
      }
    },
    MuiTab: {
      root: {
        "&:hover": {
          backgroundColor: '#999',
          color: '#fff'
        }
      },
      textColorInherit: {
        backgroundColor: '#fff',
        color: '#000',
        fontSize: '11px',
        textTransform: 'capitalize',
        border: '1px solid #e3e3e3',
        minHeight: '30px',
        opacity: 1,
        "&:hover": {
          backgroundColor: '#444',
          opacity: 1,
          color: '#fff',
        },
        '&$selected': {
          backgroundColor: '#000',
          color: '#fff',
          borderBottom: '2px solid #4b4b4b'
        },
      },
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

import colors from './colors';

const theme =  {
  typography: {
    fontFamily: "'Poppins', sans-serif",
    lineHeight: 1.45,
    useNextVariants: true,
    fontSize: 14,
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
        background: '#4a4a63',
        border: '1px solid #4a4a63',
        color: '#fff',
        borderRadius: '8px !important',
        height: '52px'
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '14px',
        background: 'transparent'
      },
      notchedOutline: {
        border: "none"
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
        color: "#fff"
      },
      colorPrimary: {
        color: '#fff',
        fontSize: '14px',
      },
      body1:
      {
        color: '#fff'
      },
      h6:
      {
        color: '#fff',
        marginBottom: '10px !important'
      },
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
        color: '#fff',
        background: '#67C22D',
        borderRadius: '10px',
        marginTop: '15px'
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
        backgroundColor: '#333344',
        borderRadius: '10px',
        paddingLeft: '6px'
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
        backgroundColor: '#4a4a63',
        color: '#fff',
        fontSize: '11px',
        textTransform: 'capitalize',
        border: 'none',
        minHeight: '30px',
        opacity: 1,
        marginTop: '6px',
        "&:hover": {
          backgroundColor: '#2f60cc',
          opacity: 1,
          color: '#fff',
        },
        '&$selected': {
          backgroundColor: '#3773f7',
          color: '#fff',
          borderBottom: '0px solid #2e9a34'
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

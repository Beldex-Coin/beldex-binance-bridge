const styles = theme => ({
  root: {
    position: 'relative',
  },
  button: {
    minWidth: '100px',
    fontWeight: 600,
    border: `1px solid #fff`,
    transition: 'all 0.2s ease-in-out',
    padding: '0.8rem 2.5rem',
    letterSpacing: '0.03em',
    fontSize: '14px',
    backgroundColor: '#000',
    color: '#fff',
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: '#fff',
      color: '#000',
      border: `1px solid #000`,
    }
  },
  secondary: {
    border: `1px solid ${theme.palette.secondary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    }
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

export default styles;

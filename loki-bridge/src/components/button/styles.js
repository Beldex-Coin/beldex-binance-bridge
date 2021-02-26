const styles = theme => ({
  root: {
    position: 'relative',
  },
  button: {
    minWidth: '100px',
    fontWeight: 700,
    border: `1px solid #fff`,
    transition: 'all 0.2s ease-in-out',
    padding: '0.8rem 2.5rem',
    letterSpacing: '0.03em',
    fontSize: '0.8rem',
    backgroundColor: '#fff',
    color: '#000',
    '&:hover': {
      backgroundColor: '#000',
      color: 'white',
      border: `1px solid #fff`,
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

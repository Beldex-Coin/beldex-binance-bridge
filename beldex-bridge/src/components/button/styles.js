const styles = theme => ({
  root: {
    position: 'relative',
  },
  button: {
    minWidth: '100px',
    fontWeight: 600,
    border: 'none',
    transition: 'all 0.2s ease-in-out',
    padding: '0.8rem 2.5rem',
    letterSpacing: '0.03em',
    fontSize: '14px',
    backgroundColor: '#20c128',
    color: '#000',
    textTransform: 'capitalize',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#198c1e',
      color: '#fff',
      border: 'none'
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

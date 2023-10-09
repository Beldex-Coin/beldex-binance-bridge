const styles = (theme) => ({
  root: {
    
    maxWidth:'700px',
    // borderRadius: '16px',
    background: "#1F1F2E",

  
  
  },
  
 

  title: {
    backgroundColor: "#1F1F2E",
    color: "white",
    width: '380px',
    textAlign: 'center',

    "& .MuiTypography-h6": {
      fontSize: "1.3rem !important",
      marginBottom:'0 !important'
    },
    
    
  },
  wallet:{
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    border: '1px solid #393954',
    width: '100%',
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: '1.1rem',
    '&:hover': {
      backgroundColor: '#282837'
    }
  }
});

export default styles;

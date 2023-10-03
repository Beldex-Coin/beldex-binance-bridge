import { common } from '@theme';

const styles = theme => ({
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  itemColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  spaceBetweenRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statTitle: {
    marginRight: '4px',
    fontSize: '0.84rem'
  },
  statAmount: {
    fontWeight: '600',
    fontSize: '0.94rem'
  },
  transactionTitle: {
    fontSize: '16px'
  },
  hash:{
    fontSize: '14px'
  },
  section: {
    ...common.section,
    height: '467px',
    overflowX: 'hidden',
    [theme.breakpoints.up('md')]: {
      maxWidth: '800px',
      margin: 'auto',
    }
  },
  registerWrapper:{
    width:'100%',
    display:'flex',
    justifyContent:'center',
    alignItem:'center'

  },
  leftPane:{
    width:'100%',
    height:'100%',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center'

  }
});

export default styles;

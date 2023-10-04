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
  txHeader: {
    backgroundColor: '#2E2E44',
    borderRadius: '10px',
    padding: '7px'
  },
  statTitle: {
    marginRight: '4px',
    fontSize: '0.84rem',
    color: '#AFAFBE',
    fontWeight: '600',
  },
  statAmount: {
    color: '#EBEBEB',
    fontWeight: '600',
    fontSize: '0.94rem'
  },
  transactionTitle: {
    fontSize: '16px',
    fontWeight: '600'
  },
  hash: {
    fontSize: '14px'
  },
  section: {
    ...common.section,
    height: '467px',
    padding: '10px',
    [theme.breakpoints.up('md')]: {
      maxWidth: '800px',
      margin: 'auto',
    }
  },
  sectionSwap: {
    ...common.section,
    height: '467px',
    overflowX: 'hidden',
    padding: '10px',
    [theme.breakpoints.up('md')]: {
      maxWidth: '800px',
      margin: 'auto',
    }
  },
  registerWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center'

  },
  registerWrapperRow: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection:'column',
    justifyContent: 'center',
    alignItem: 'center',
    padding: '15px',
    border: '0.5px #56566C solid',
    backgroundColor: '#1C1C26',
    borderRadius: '20px',
    marginTop:'15px'

  },
  leftPane: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  swapList: {
    borderRadius: '10px',
    border: '1px #393954 solid'
  },
  scroll: {
    overflowX: 'hidden',
  }
});

export default styles;

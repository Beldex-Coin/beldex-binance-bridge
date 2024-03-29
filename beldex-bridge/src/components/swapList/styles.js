import { orange } from '@material-ui/core/colors';

const styles = theme => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  item: {
    padding: theme.spacing(1, 2),
    borderBottom: '0px solid #d4d4d4',
    background: '#4a4a63',
    borderRadius: '10px'
  },
  pending: {
    color: orange[500]
  },
  completed: {
    color: '#338a14'
  },
  time: {
    fontSize: '1em'
  },
  timeSeperator: {
    margin: '0 4px'
  },
  divider: {
    margin: '8px 0'
  },
  hashTitle: {
    fontWeight: '500',
    fontSize: '1em',
    marginRight: '4px'
  },
  hash: {
    fontStyle: 'italic',
    overflowWrap: 'break-word'
  },
  amount: {
    fontSize: '1.25em',
    fontWeight: '500'
  },
  emptyTitle: {
    padding: theme.spacing(1, 0),
    color: '#666'
  }
});

export default styles;

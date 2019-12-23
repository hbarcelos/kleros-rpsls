import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Routes from '../../app/router/Routes';

const useTitleStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export interface DialogTitleProps {
  onClose: () => void;
  [x: string]: unknown;
}

const DialogTitle: React.SFC<DialogTitleProps> = ({
  children,
  onClose,
  ...other
}) => {
  const cl = useTitleStyles();

  return (
    <MuiDialogTitle disableTypography className={cl.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={cl.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useStyles = makeStyles(theme => ({
  vSpacer: {
    marginBottom: theme.spacing(2),
  },
  gameDataParameter: {
    backgroundColor: theme.palette.background.default,
    border: '1px dashed',
    borderRadius: theme.spacing(1),
    fontFamily: 'monospace',
    fontSize: theme.typography.body2.fontSize,
    padding: theme.spacing(1.5, 3),
    textAlign: 'center',
    margin: theme.spacing(2, 0),
    wordWrap: 'break-word',
  },
}));

interface NewGameStatsDialogProps {
  move: string;
  salt: string;
  contractAddress: string;
  playerTwoAddress: string;
  open: boolean;
  handleClose: () => void;
}

const NewGameStatsDialog: React.SFC<NewGameStatsDialogProps> = ({
  salt,
  move,
  playerTwoAddress,
  contractAddress,
  open,
  handleClose,
}) => {
  const cl = useStyles();

  return (
    <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open}>
      <DialogTitle id="dialog-title" onClose={handleClose}>
        New Game Created
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          <strong>Game</strong> deployed at:
        </Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {contractAddress}
        </Typography>
        <Typography>
          Please send the address above to <strong>Player 2</strong>:
        </Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {playerTwoAddress}
        </Typography>
        <Divider className={cl.vSpacer} />
        <Typography gutterBottom>
          You must <strong>wait</strong> Player 2 make his/her move.
        </Typography>
        <Typography>
          To settle the match, you must reveal your <strong>move</strong>:
        </Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {move}
        </Typography>
        <Typography>
          along side the following <strong>salt</strong> value:
        </Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {salt}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={Routes.CONNECT_GAME.replace(':address', contractAddress)}
        >
          Go to Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewGameStatsDialog.defaultProps = {
  open: false,
};

export default NewGameStatsDialog;

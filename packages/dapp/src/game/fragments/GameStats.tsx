import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

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

export interface GameStatsProps {
  address: string;
  playerOneAddress: string;
  playerOneCommitment: string;
  playerTwoAddress: string;
  playerTwoMove: string;
  lastAction: Date;
}

const df = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short',
});

const NewGameStatsDialog: React.SFC<GameStatsProps> = ({
  address,
  playerOneAddress,
  playerOneCommitment,
  playerTwoAddress,
  playerTwoMove,
  lastAction,
}) => {
  const cl = useStyles();

  return (
    <React.Fragment>
      <Typography>Game Address:</Typography>
      <Typography
        color="secondary"
        className={cl.gameDataParameter}
        gutterBottom
      >
        {address}
      </Typography>
      <Typography>Player 1:</Typography>
      <Typography
        color="secondary"
        className={cl.gameDataParameter}
        gutterBottom
      >
        {playerOneAddress}
      </Typography>
      <Typography>Player 1 Hashed Move:</Typography>
      <Typography
        color="secondary"
        className={cl.gameDataParameter}
        gutterBottom
      >
        {playerOneCommitment}
      </Typography>
      <Typography>Player 2:</Typography>
      <Typography
        color="secondary"
        className={cl.gameDataParameter}
        gutterBottom
      >
        {playerTwoAddress}
      </Typography>
      <Divider className={cl.vSpacer} />
      <Typography>Player 2 move:</Typography>
      <Typography
        color="secondary"
        className={cl.gameDataParameter}
        gutterBottom
      >
        {playerTwoMove || `-- Still Pending --`}
      </Typography>
      <Typography>Last Action:</Typography>
      <Typography
        color="secondary"
        className={cl.gameDataParameter}
        gutterBottom
      >
        {df.format(lastAction)}
      </Typography>
    </React.Fragment>
  );
};

export default NewGameStatsDialog;

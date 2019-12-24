import React, { useContext } from 'react';
import clsx from 'clsx';
import { formatEther } from 'ethers/utils';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import SuccessIcon from '@material-ui/icons/Check';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import green from '@material-ui/core/colors/green';
import ConnectGameContext from '../contexts/ConnectGameContext';
import { isSettled, Move, MoveLabel } from '../store/models';

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
  missingParameter: {
    opacity: 0.5,
  },
  settledChip: {
    marginLeft: theme.spacing(1),
    backgroundColor: green[400],
    color: theme.palette.getContrastText(green[400]),
  },
  ongoingChip: {
    marginLeft: theme.spacing(1),
  },
  chipIcon: {
    color: 'inherit',
  },
}));

const df = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short',
});

const nf = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 4,
  useGrouping: true,
});

const NewGameStatsDialog: React.SFC<{}> = () => {
  const cl = useStyles();

  const [{ gameData, isLoading }] = useContext(ConnectGameContext);
  const { address, result, playerOne, playerTwo, lastAction, stake } = gameData;
  const alreadySettled = isSettled(gameData);

  return (
    <Card>
      {isLoading && <LinearProgress color="secondary" />}
      <CardHeader
        title={
          <React.Fragment>
            Game Data
            {alreadySettled ? (
              <Chip
                size="small"
                label="Settled"
                className={cl.settledChip}
                icon={<SuccessIcon className={cl.chipIcon} />}
              />
            ) : (
              <Chip
                size="small"
                label="Ongoing"
                className={cl.ongoingChip}
                icon={<HourglassEmptyIcon className={cl.chipIcon} />}
              />
            )}
          </React.Fragment>
        }
      />
      <CardContent>
        <Typography>Game Address:</Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {address}
        </Typography>

        {Number(stake) !== 0 && (
          <React.Fragment>
            <Typography>Stake:</Typography>
            <Typography
              color="secondary"
              className={cl.gameDataParameter}
              gutterBottom
            >
              {nf.format(Number(formatEther(stake)))} ETH
            </Typography>
          </React.Fragment>
        )}

        {result && (
          <React.Fragment>
            <Typography>Game Result:</Typography>
            <Typography
              color="secondary"
              className={cl.gameDataParameter}
              gutterBottom
            >
              {result}
            </Typography>
          </React.Fragment>
        )}

        <Typography>Last Action:</Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {df.format(lastAction)}
        </Typography>

        <Divider className={cl.vSpacer} />

        <Typography>Player 1:</Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {playerOne.address}
        </Typography>

        <Typography>Player 1 Hashed Move:</Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {String(playerOne.commitment)}
        </Typography>

        {playerOne.move && (
          <React.Fragment>
            <Typography>Player 1 Revealed Move:</Typography>
            <Typography
              color="secondary"
              className={cl.gameDataParameter}
              gutterBottom
            >
              {MoveLabel[playerOne.move as Move]}
            </Typography>
          </React.Fragment>
        )}

        {playerOne.salt && (
          <React.Fragment>
            <Typography>Player 1 Salt:</Typography>
            <Typography
              color="secondary"
              className={cl.gameDataParameter}
              gutterBottom
            >
              {String(playerOne.salt)}
            </Typography>
          </React.Fragment>
        )}

        <Divider className={cl.vSpacer} />

        <Typography>Player 2:</Typography>
        <Typography
          color="secondary"
          className={cl.gameDataParameter}
          gutterBottom
        >
          {playerTwo.address}
        </Typography>

        <Typography>Player 2 move:</Typography>
        <Typography
          color="secondary"
          className={clsx(cl.gameDataParameter, {
            [cl.missingParameter]: !playerTwo.move,
          })}
          gutterBottom
        >
          {playerTwo.move
            ? MoveLabel[playerTwo.move as Move]
            : `-- Still Pending --`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NewGameStatsDialog;

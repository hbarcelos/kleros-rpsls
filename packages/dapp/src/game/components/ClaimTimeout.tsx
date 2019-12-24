import React, { useState, useCallback, useContext } from 'react';
import { useInterval } from 'react-use';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import useContract from '../../shared/hooks/useContract';
import fetchGameData from '../../service/fetchGameData';
import { RPS } from '../../contracts.json';
import {
  setIsSubmitting,
  setIsLoading,
  setGameData,
} from '../store/connectGameSlice';
import ConnectGameContext from '../contexts/ConnectGameContext';
import {
  canPlayerOneClaimTimeout,
  canPlayerTwoClaimTimeout,
  secondsUntilTimeout,
} from '../store/models';

interface InactiveClaimButtonProps {
  handleTimeout: () => void;
}

const InactiveClaimButton: React.SFC<InactiveClaimButtonProps> = ({
  handleTimeout,
}) => {
  const [{ gameData }] = useContext(ConnectGameContext);

  const [timeoutInSeconds, setTimeoutInSeconds] = useState(
    secondsUntilTimeout(gameData, new Date())
  );

  useInterval(() => {
    const secondsLeft = secondsUntilTimeout(gameData, new Date());
    if (secondsLeft >= 0) {
      setTimeoutInSeconds(secondsLeft);
    } else {
      handleTimeout();
    }
  }, 1000);

  return (
    <Button disabled variant="contained" color="primary">
      Claim Refund in {timeoutInSeconds} seconds
    </Button>
  );
};

const useStyles = makeStyles(theme => ({
  marginBottom: { marginBottom: theme.spacing(2) },
}));

export interface ClaimTimeoutProps {
  player: 'playerOne' | 'playerTwo';
}

const ClaimTimeout: React.SFC<ClaimTimeoutProps> = ({ player }) => {
  const cl = useStyles();

  const [{ isSubmitting, gameData }, dispatch] = useContext(ConnectGameContext);

  const contract = useContract({ abi: RPS.abi, address: gameData.address });

  const currentDate = new Date();
  const [canClaimTimeout, setCanClaimTimeout] = useState(
    player === 'playerOne'
      ? canPlayerOneClaimTimeout(gameData, currentDate)
      : canPlayerTwoClaimTimeout(gameData, currentDate)
  );

  const handleTimeout = useCallback(() => {
    setCanClaimTimeout(true);
  }, [setCanClaimTimeout]);

  const handleClaimTimeout = useCallback(async () => {
    try {
      dispatch(setIsSubmitting(true));

      const promise =
        player === 'playerOne' ? contract.j2Timeout() : contract.j1Timeout();
      const txn = await promise;
      await txn.wait();
    } catch (err) {
      console.error('Error on claiming timeout:', err);
    } finally {
      dispatch(setIsSubmitting(false));

      try {
        dispatch(setIsLoading(true));
        dispatch(setGameData(await fetchGameData(contract)));
      } finally {
        dispatch(setIsLoading(false));
      }
    }
  }, [contract, dispatch, player]);

  return (
    <Card className={cl.marginBottom}>
      {isSubmitting && <LinearProgress color="secondary" />}
      <CardHeader
        title={
          player === 'playerOne'
            ? 'Player 1 Claim Refund'
            : 'Player 2 Claim Refund'
        }
      />
      <CardContent>
        <Typography variant="body1">
          You can claim a refund if the other player takes too long to respond.
        </Typography>
      </CardContent>
      <CardActions>
        {canClaimTimeout ? (
          <Button
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={handleClaimTimeout}
          >
            Claim Refund
          </Button>
        ) : (
          <InactiveClaimButton handleTimeout={handleTimeout} />
        )}
      </CardActions>
    </Card>
  );
};

export default ClaimTimeout;

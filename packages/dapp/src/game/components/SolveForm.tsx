import React, { useContext, useCallback } from 'react';
import { bigNumberify } from 'ethers/utils';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import LinearProgress from '@material-ui/core/LinearProgress';
import { validateHexString } from '../../shared/validation';
import useFormInput from '../../shared/hooks/useFormInput';
import useForm from '../../shared/hooks/useForm';
import useContract from '../../shared/hooks/useContract';
import fetchGameData from '../../service/fetchGameData';
import ConnectGameContext from '../contexts/ConnectGameContext';
import {
  setIsSubmitting,
  setIsLoading,
  setGameData,
} from '../store/connectGameSlice';
import { RPS } from '../../contracts.json';
import { Move, validateMove, MoveLabel } from '../store/models';

const useStyles = makeStyles(theme => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
}));

const SolveForm: React.SFC<{}> = () => {
  const cl = useStyles();

  const [{ isSubmitting, gameData }, dispatch] = useContext(ConnectGameContext);

  const contract = useContract({ abi: RPS.abi, address: gameData.address });

  const onSubmit = useCallback(
    async (data: any) => {
      dispatch(setIsSubmitting(true));
      const { move, salt } = data;

      try {
        const txn = await contract.solve(move, bigNumberify(salt));
        await txn.wait();
      } catch (err) {
        console.error('Error during solve() transaction:', err);
      } finally {
        dispatch(setIsSubmitting(false));

        try {
          dispatch(setIsLoading(true));

          const [
            updatedGameData,
            playerOneWins,
            playerTwoWins,
          ] = await Promise.all([
            fetchGameData(contract),
            contract.win(move, gameData.playerTwo.move),
            contract.win(gameData.playerTwo.move, move),
          ]);

          const result = playerOneWins
            ? 'Player 1 wins'
            : playerTwoWins
            ? 'Player 2 wins'
            : 'It was a tie';

          updatedGameData.playerOne.move = Number(move) as Move;
          updatedGameData.playerOne.salt = bigNumberify(salt);
          updatedGameData.result = result;

          dispatch(setGameData(updatedGameData));
        } finally {
          dispatch(setIsLoading(false));
        }
      }
    },
    [contract, dispatch, gameData.playerTwo.move]
  );

  const { inputs, canSubmit, handleSubmit } = useForm({
    inputs: {
      move: useFormInput<number>({
        defaultValue: Move.Null,
        validate: validateMove,
      }),
      salt: useFormInput<string>({
        defaultValue: '',
        validate: validateHexString,
      }),
    },
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className={cl.marginBottom}>
      <Card>
        {isSubmitting && <LinearProgress color="secondary" />}
        <CardHeader title="Player 1 Reveal" />
        <CardContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Move"
            value={inputs.move.value}
            error={inputs.move.hasError}
            onChange={inputs.move.handleChange}
            onBlur={inputs.move.handleBlur}
            helperText={inputs.move.hasError && inputs.move.error}
            SelectProps={{
              native: true,
            }}
          >
            {Object.entries(MoveLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Salt"
            value={inputs.salt.value}
            error={inputs.salt.hasError}
            onChange={inputs.salt.handleChange}
            onBlur={inputs.salt.handleBlur}
            helperText={inputs.salt.hasError && inputs.salt.error}
          />
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !canSubmit}
            className={cl.marginTop}
          >
            Reaveal Your Move
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default SolveForm;

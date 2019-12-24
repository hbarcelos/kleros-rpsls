import React, { useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import LinearProgress from '@material-ui/core/LinearProgress';
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

const PlayForm: React.SFC<{}> = () => {
  const cl = useStyles();

  const [{ isSubmitting, gameData }, dispatch] = useContext(ConnectGameContext);
  const { stake, address } = gameData;
  const contract = useContract({ abi: RPS.abi, address });

  const onSubmit = useCallback(
    async (data: any) => {
      dispatch(setIsSubmitting(true));
      const { move } = data;

      try {
        const txn = await contract.play(move, {
          value: stake,
        });
        await txn.wait();
      } catch (err) {
        console.error('Error during play() transaction:', err);
      } finally {
        dispatch(setIsSubmitting(false));

        try {
          dispatch(setIsLoading(true));
          dispatch(setGameData(await fetchGameData(contract)));
        } finally {
          dispatch(setIsLoading(false));
        }
      }
    },
    [contract, dispatch, stake]
  );

  const { inputs, canSubmit, handleSubmit } = useForm({
    inputs: {
      move: useFormInput<number>({
        defaultValue: Move.Null,
        validate: validateMove,
      }),
    },
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className={cl.marginBottom}>
      <Card>
        {isSubmitting && <LinearProgress color="secondary" />}
        <CardHeader title="Player 2 Choose Your Move" />
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
            Make a Move
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default PlayForm;

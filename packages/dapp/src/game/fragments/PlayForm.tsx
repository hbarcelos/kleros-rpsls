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
import useFormInput from '../../shared/hooks/useFormInput';
import useForm from '../../shared/hooks/useForm';
import useContract from '../../shared/hooks/useContract';
import useGameData from '../hooks/useGameData';
import ConnectGameContext from '../contexts/ConnectGameContext';
import { setIsSubmitting } from '../store/connectGameSlice';
import { RPS } from '../../contracts.json';
import { Move, validateMove, MoveLabel } from '../store/models';

const useStyles = makeStyles(theme => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

export interface PlayFormProps {
  gameAddress: string;
}

const PlayForm: React.SFC<PlayFormProps> = ({ gameAddress }) => {
  const cl = useStyles();

  const { stake } = useGameData({ address: gameAddress });
  const contract = useContract({ abi: RPS.abi, address: gameAddress });

  const [{ isSubmitting }, dispatch] = useContext(ConnectGameContext);

  const onSubmit = useCallback(
    async (data: any) => {
      dispatch(setIsSubmitting(true));
      const { move } = data;

      try {
        const txn = await contract.play(move, {
          value: bigNumberify(stake),
        });
        await txn.wait();
      } catch (err) {
        console.error('Error during play() transaction:', err);
      } finally {
        dispatch(setIsSubmitting(false));
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
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Player 2" />
        <CardContent>
          {isSubmitting && <LinearProgress color="secondary" />}

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
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !canSubmit}
            className={cl.marginTop}
          >
            Make a Move
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className={cl.marginTop}
          >
            Claim Timeout
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default PlayForm;

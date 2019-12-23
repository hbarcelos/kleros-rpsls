import React, { useState, useCallback } from 'react';
import { useEtherProvider, useAccount } from 'use-ether-provider';
import { parseEther } from 'ethers/utils';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import LinearProgress from '@material-ui/core/LinearProgress';
import Layout from '../../fragments/Layout';
import useFormInput from '../../shared/hooks/useFormInput';
import useForm from '../../shared/hooks/useForm';
import useContract from '../../shared/hooks/useContract';
import useContractFactory from '../../shared/hooks/useContractFactory';
import { Hasher, RPS } from '../../contracts.json';
import safeRandomNumber from '../../shared/security/safeRandomNumber';
import {
  validateAddress,
  validatePositiveNumber,
} from '../../shared/validation';
import { Move, MoveLabel, validateMove } from '../store/models';
import NewGameStatsDialog from '../fragments/NewGameStatsDialog';

const createValidatePlayerTwo = (currentAddress: string) => (
  playerTwoAddress: string
): true | string => {
  const isValidAddress = validateAddress(playerTwoAddress);
  if (isValidAddress !== true) {
    return isValidAddress;
  }

  return (
    currentAddress !== playerTwoAddress || 'Cannot be the same current address'
  );
};

const CreateNewGame: React.SFC<{}> = () => {
  const [isDeployed, setIsDeployed] = useState(false);
  const [contractAddress, setContractAddresss] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salt, setSalt] = useState('');
  const hasherContract = useContract(Hasher);
  const rpsContractFactory = useContractFactory(RPS);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleOpenModal = useCallback((): void => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
  }, []);

  const onSubmit = useCallback(
    async (data: any): Promise<void> => {
      const { playerOneMove, playerTwoAddress, stake } = data;
      setIsSubmitting(true);

      const newSalt = safeRandomNumber();
      setSalt(newSalt.toHexString());

      try {
        const playerOneCommitment = await hasherContract.hash(
          playerOneMove,
          newSalt
        );

        const contract = await rpsContractFactory.deploy(
          playerOneCommitment,
          playerTwoAddress,
          {
            value: parseEther(String(stake)),
          }
        );

        setContractAddresss(contract.address);

        await contract.deployed();
        setIsDeployed(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [hasherContract, rpsContractFactory]
  );

  const provider = useEtherProvider();
  const accountAddress = useAccount(provider!);
  const validatePlayerTwo = createValidatePlayerTwo(accountAddress);

  const { inputs, canSubmit, handleSubmit } = useForm({
    inputs: {
      playerTwoAddress: useFormInput<string>({
        defaultValue: '',
        validate: validatePlayerTwo,
      }),
      stake: useFormInput<number>({
        defaultValue: 0,
        validate: validatePositiveNumber,
      }),
      playerOneMove: useFormInput<number>({
        defaultValue: Move.Null,
        validate: validateMove,
      }),
    },
    onSubmit,
  });

  return (
    <Layout>
      <form onSubmit={handleSubmit} noValidate>
        <Card>
          {isSubmitting && <LinearProgress color="secondary" />}
          <CardHeader title="Create New Game" />
          <CardContent>
            <TextField
              fullWidth
              margin="normal"
              label="Player 2 Address"
              placeholder="Ex.: 0x00000000000000000000000000000000"
              value={inputs.playerTwoAddress.value}
              error={inputs.playerTwoAddress.hasError}
              onChange={inputs.playerTwoAddress.handleChange}
              onBlur={inputs.playerTwoAddress.handleBlur}
              helperText={
                inputs.playerTwoAddress.hasError &&
                inputs.playerTwoAddress.error
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Stake (in ethers)"
              placeholder="Ex.: 0.1"
              value={inputs.stake.value}
              error={inputs.stake.hasError}
              onChange={inputs.stake.handleChange}
              onBlur={inputs.stake.handleBlur}
              helperText={inputs.stake.hasError && inputs.stake.error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ETH</InputAdornment>
                ),
              }}
              inputProps={{
                type: 'number',
                min: 0.001,
                step: 0.001,
              }}
            />
            <TextField
              select
              fullWidth
              margin="normal"
              labgameAddress
              value={inputs.playerOneMove.value}
              error={inputs.playerOneMove.hasError}
              onChange={inputs.playerOneMove.handleChange}
              onBlur={inputs.playerOneMove.handleBlur}
              helperText={
                inputs.playerOneMove.hasError && inputs.playerOneMove.error
              }
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
            {/* {true && ( */}
            {isDeployed && (
              <React.Fragment>
                <Button onClick={handleOpenModal}>Show Game Information</Button>
                <NewGameStatsDialog
                  move={MoveLabel[inputs.playerOneMove.value as Move]}
                  salt={salt}
                  contractAddress={contractAddress}
                  playerTwoAddress={inputs.playerTwoAddress.value}
                  open={isModalOpen}
                  handleClose={handleCloseModal}
                />
              </React.Fragment>
            )}
          </CardContent>
          <CardActions>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !canSubmit}
            >
              Create Game
            </Button>
          </CardActions>
        </Card>
      </form>
    </Layout>
  );
};

export default CreateNewGame;

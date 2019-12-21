import React, { useState, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import useFormInput from '../../shared/hooks/useFormInput';
import Routes from '../../app/router/Routes';
import Layout from '../../fragments/Layout';

const useStyles = makeStyles(theme => ({
  vMargin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  textCenter: {
    textAlign: 'center',
  },
}));

const validateAddress = (address: string): true | string =>
  /^0x[a-fA-F0-9]{40}$/.test(address) || 'Invalid address';

const Home: React.SFC<{}> = () => {
  const cl = useStyles();
  const history = useHistory();

  const gameAddress = useFormInput<string>({
    defaultValue: '',
    validate: validateAddress,
  });

  const handleSubmit = useCallback(
    evt => {
      evt.preventDefault();
      gameAddress.triggerValidation();
      if (gameAddress.touched && !gameAddress.hasError) {
        history.push(
          Routes.CONNECT_GAME.replace(':address', gameAddress.value)
        );
      }
    },
    [gameAddress, history]
  );

  return (
    <Layout>
      <Card>
        <CardHeader title="What would you like to do?" />
        <CardContent>
          <Button
            fullWidth
            size="large"
            component={Link}
            to={Routes.NEW_GAME}
            variant="contained"
            color="primary"
            className={cl.vMargin}
          >
            Create a new game
          </Button>
          <Divider className={cl.vMargin} />
          <Typography variant="h6" className={cl.textCenter}>
            - or -
          </Typography>
          <Divider className={cl.vMargin} />
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Game Address"
              placeholder="Ex.: 0x00000000000000000000000000000000"
              value={gameAddress.value}
              error={gameAddress.hasError}
              onChange={gameAddress.handleChange}
              onBlur={gameAddress.handleBlur}
              helperText={gameAddress.hasError && gameAddress.error}
            />
            <Button
              fullWidth
              type="submit"
              size="large"
              variant="contained"
              className={cl.vMargin}
              color="secondary"
            >
              Connect to an existing game
            </Button>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Home;

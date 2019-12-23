import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useEtherProvider, useAccount } from 'use-ether-provider';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Layout from '../../fragments/Layout';
import GameStats from '../fragments/GameStats';
import PlayerTwoActions from '../fragments/PlayerTwoActions';
import useGameData from '../hooks/useGameData';
import ConnectGameContext from '../contexts/ConnectGameContext';
import { MoveLabel, Move } from '../store/models';

const useStyles = makeStyles(theme => ({
  vSpacer: {
    margin: theme.spacing(1, 0, 2),
  },
}));

const ConnectGame: React.SFC<{}> = () => {
  const cl = useStyles();

  const { address = '' } = useParams();
  const data = useGameData({ address });

  const provider = useEtherProvider();
  const accountAddress = useAccount(provider!);

  const isPlayerOne = accountAddress === data.playerOne.address;
  const isPlayerTwo = accountAddress === data.playerTwo.address;

  const [{ isSubmitting }] = useContext(ConnectGameContext);

  return (
    <Layout>
      {isPlayerTwo && <PlayerTwoActions gameAddress={address} />}
      <Card>
        <CardHeader title={`Game Data`} />
        <CardContent>
          <GameStats
            address={data.address}
            playerOneAddress={data.playerOne.address}
            playerTwoAddress={data.playerTwo.address}
            playerOneCommitment={String(data.playerOne.commitment)}
            playerTwoMove={MoveLabel[data.playerTwo.move as Move]}
            lastAction={data.lastAction}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ConnectGame;

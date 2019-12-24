import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useEtherProvider, useAccount } from 'use-ether-provider';
import Layout from '../../app/fragments/Layout';
import BlockingLoader from '../../app/fragments/BlockingLoader';
import GameStats from '../fragments/GameStats';
import PlayerTwoActions from '../fragments/PlayerTwoActions';
import PlayerOneActions from '../fragments/PlayerOneActions';
import CreateGameFloatingButton from '../components/CreateGameFloatingButton';
import useFetchGameData from '../hooks/useFetchGameData';
import ConnectGameContext, {
  ConnectGameProvider,
} from '../contexts/ConnectGameContext';

const ConnectGameElements: React.SFC<{}> = () => {
  const { address = '' } = useParams();

  useFetchGameData({ address });

  const [{ gameData }] = useContext(ConnectGameContext);

  const provider = useEtherProvider();
  const accountAddress = useAccount(provider!);

  const isPlayerOne = accountAddress === gameData.playerOne.address;
  const isPlayerTwo = accountAddress === gameData.playerTwo.address;

  return (
    <React.Fragment>
      <CreateGameFloatingButton />
      {gameData.address ? (
        <React.Fragment>
          {isPlayerOne && <PlayerOneActions />}
          {isPlayerTwo && <PlayerTwoActions />}
          <GameStats />
        </React.Fragment>
      ) : (
        <BlockingLoader />
      )}
    </React.Fragment>
  );
};

const ConnectGame: React.SFC<{}> = () => {
  return (
    <ConnectGameProvider>
      <Layout>
        <ConnectGameElements />
      </Layout>
    </ConnectGameProvider>
  );
};

export default ConnectGame;

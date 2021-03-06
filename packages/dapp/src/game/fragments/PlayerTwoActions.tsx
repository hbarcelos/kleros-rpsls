import React, { useContext } from 'react';
import { hasPlayerTwoPlayed, isSettled } from '../store/models';
import PlayForm from '../components/PlayForm';
import ClaimTimeout from '../components/ClaimTimeout';
import ConnectGameContext from '../contexts/ConnectGameContext';

const PlayerTwoActions: React.SFC<{}> = () => {
  const [{ gameData }] = useContext(ConnectGameContext);
  const hasPlayed = hasPlayerTwoPlayed(gameData);
  const alreadySettled = isSettled(gameData);

  return (
    <React.Fragment>
      {!hasPlayed ? <PlayForm /> : null}
      {hasPlayed && !alreadySettled ? (
        <ClaimTimeout player="playerTwo" />
      ) : null}
    </React.Fragment>
  );
};

export default PlayerTwoActions;

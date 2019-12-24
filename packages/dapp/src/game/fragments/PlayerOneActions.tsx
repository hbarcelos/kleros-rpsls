import React, { useContext } from 'react';
import { hasPlayerTwoPlayed, isSettled } from '../store/models';
import SolveForm from '../components/SolveForm';
import ClaimTimeout from '../components/ClaimTimeout';
import ConnectGameContext from '../contexts/ConnectGameContext';

const PlayerOneActions: React.SFC<{}> = () => {
  const [{ gameData }] = useContext(ConnectGameContext);
  const hasPlayed = hasPlayerTwoPlayed(gameData);
  const alreadySettled = isSettled(gameData);

  return (
    <React.Fragment>
      {hasPlayed && !alreadySettled ? <SolveForm /> : null}
      {!hasPlayed && !alreadySettled ? (
        <ClaimTimeout player="playerOne" />
      ) : null}
    </React.Fragment>
  );
};

export default PlayerOneActions;

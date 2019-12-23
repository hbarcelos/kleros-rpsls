import React from 'react';
import useGameData from '../hooks/useGameData';
import PlayForm from '../fragments/PlayForm';
import Typography from '@material-ui/core/Typography';

export interface PlayerTwoActionsProps {
  gameAddress: string;
}

const PlayerTwoActions: React.SFC<PlayerTwoActionsProps> = ({
  gameAddress,
}) => {
  const data = useGameData({ address: gameAddress });

  return !data.playerTwo.move ? (
    <React.Fragment>
      <PlayForm gameAddress={gameAddress} />
    </React.Fragment>
  ) : null;
};

export default PlayerTwoActions;

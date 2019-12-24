import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Routes from '../../app/router/Routes';

const useStyles = makeStyles(theme => ({
  buttonTop: {
    marginBottom: theme.spacing(2),
  },
  buttonBottom: {
    marginTop: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

interface CreateGameFloatingButtonProps {
  position?: 'top' | 'bottom';
}

const CreateGameFloatingButton: React.SFC<CreateGameFloatingButtonProps> = ({
  position,
}) => {
  const cl = useStyles();

  return (
    <Fab
      variant="extended"
      component={Link}
      to={Routes.NEW_GAME}
      className={clsx({
        [cl.buttonTop]: position === 'top',
        [cl.buttonBottom]: position === 'bottom',
      })}
    >
      <AddIcon className={cl.extendedIcon} />
      Create New Game
    </Fab>
  );
};

CreateGameFloatingButton.defaultProps = {
  position: 'top',
};

export default CreateGameFloatingButton;

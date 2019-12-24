import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  fullHeight: {
    height: '100vh',
  },
}));

const BlockingLoader: React.SFC<{}> = () => {
  const cl = useStyles();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      className={cl.fullHeight}
    >
      <CircularProgress color="primary" size="20vmax" />
    </Box>
  );
};

export default memo(BlockingLoader);

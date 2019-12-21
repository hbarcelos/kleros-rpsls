import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export interface ProviderErrorProps {
  message: string;
}

const useStyles = makeStyles(theme => ({
  fullHeight: {
    height: '100vh',
  },
  errorTitle: {
    color: theme.palette.error.main,
  },
  errorMessage: {
    color: theme.palette.error.main,
  },
}));

const ProviderError: React.SFC<ProviderErrorProps> = ({ message }) => {
  const cl = useStyles();

  return (
    <Box
      display="flex"
      className={cl.fullHeight}
      justifyContent="center"
      alignItems="center"
    >
      <Container maxWidth="sm">
        <Card raised>
          <CardHeader
            title="Oops, something not right!"
            className={cl.errorTitle}
          />
          <CardContent>
            <Typography variant="body1" className={cl.errorMessage}>
              {message}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default memo(ProviderError);

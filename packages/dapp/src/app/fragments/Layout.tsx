import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useEtherProvider, useAccount } from 'use-ether-provider';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(theme => ({
  pullRight: {
    marginLeft: 'auto',
  },
  accountIcon: {
    marginRight: theme.spacing(1),
  },
  addressText: {
    lineHeight: 1,
  },
  content: {
    marginTop: theme.spacing(4),
  },
}));

const Layout: React.SFC<{}> = ({ children }) => {
  const cl = useStyles();

  const provider = useEtherProvider();
  const address = useAccount(provider!);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Kleros Rock / Paper / Scissors / Lizard / Spock
          </Typography>
          <Box display="flex" alignItems="center" className={cl.pullRight}>
            <AccountCircleIcon className={cl.accountIcon} />
            <Typography variant="body2" className={cl.addressText}>
              {address}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" className={cl.content}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;

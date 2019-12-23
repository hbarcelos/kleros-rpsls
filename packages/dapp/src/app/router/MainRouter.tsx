import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Routes from './Routes';
import Home from '../pages/Home';
import CreateNewGame from '../../game/pages/CreateNewGame';
import ConnectGame from '../../game/pages/ConnectGame';

const MainRouter: React.SFC<{}> = ({ children }) => {
  return (
    <Router>
      <Switch>
        <Route exact path={Routes.HOME}>
          <Home />
        </Route>
        <Route exact path={Routes.NEW_GAME}>
          <CreateNewGame />
        </Route>
        <Route exact path={Routes.CONNECT_GAME}>
          <ConnectGame />
        </Route>
      </Switch>
      {children}
    </Router>
  );
};

export default MainRouter;

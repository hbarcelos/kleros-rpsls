import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Routes from './Routes';
import Home from '../pages/Home';

const MainRouter: React.SFC<{}> = ({ children }) => {
  return (
    <Router>
      <Switch>
        <Route exact path={Routes.HOME}>
          <Home />
        </Route>
        <Route exact path={Routes.NEW_GAME}></Route>
        <Route exact path={Routes.CONNECT_GAME}></Route>
      </Switch>
      {children}
    </Router>
  );
};

export default MainRouter;

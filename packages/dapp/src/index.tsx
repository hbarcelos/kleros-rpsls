import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';

const render = (): void => {
  const App = require('./app/App').default;

  ReactDOM.render(<App />, document.querySelector('#root'));
};

render();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', render);
}

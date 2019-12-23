import React, { createContext, useReducer, Dispatch } from 'react';
import reducer, {
  State,
  Action,
  initialState,
} from '../store/connectGameSlice';

const ConnectGameContext = createContext<[State, Dispatch<Action>]>([
  initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (): void => {},
]);

export default ConnectGameContext;

export const ConnectGameProvider: React.SFC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const Provider = ConnectGameContext.Provider;

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

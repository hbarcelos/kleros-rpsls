import { Reducer } from 'react';
import { Game, emptyGame } from '../store/models';

export interface State {
  isLoading: boolean;
  isSubmitting: boolean;
  gameData: Game;
}

export const initialState: State = {
  isSubmitting: false,
  isLoading: false,
  gameData: emptyGame,
};

export type Action =
  | {
      type: 'setIsSubmitting';
      payload: boolean;
    }
  | {
      type: 'setIsLoading';
      payload: boolean;
    }
  | {
      type: 'setGameData';
      payload: Game;
    };

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  switch (action.type) {
    case 'setIsSubmitting': {
      return { ...state, isSubmitting: action.payload };
    }
    case 'setIsLoading': {
      return { ...state, isLoading: action.payload };
    }
    case 'setGameData': {
      return { ...state, gameData: action.payload };
    }
    default:
      return state;
  }
};

export default reducer;

export const setIsSubmitting = (
  value: boolean
): { type: 'setIsSubmitting'; payload: boolean } => ({
  type: 'setIsSubmitting',
  payload: value,
});

export const setIsLoading = (
  value: boolean
): { type: 'setIsLoading'; payload: boolean } => ({
  type: 'setIsLoading',
  payload: value,
});

export const setGameData = (
  value: Game
): { type: 'setGameData'; payload: Game } => ({
  type: 'setGameData',
  payload: value,
});

import { Reducer } from 'react';

export interface State {
  isSubmitting: boolean;
}

export const initialState: State = {
  isSubmitting: false,
};

export type Action = {
  type: 'setIsSubmitting';
  payload: boolean;
};

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  switch (action.type) {
    case 'setIsSubmitting': {
      return { ...state, setIsSubmitting: action.payload };
    }
  }
};

export default reducer;

export const setIsSubmitting = (
  value: boolean
): { type: 'setIsSubmitting'; payload: boolean } => ({
  type: 'setIsSubmitting',
  payload: value,
});

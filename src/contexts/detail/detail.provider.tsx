import React, { useReducer } from 'react';
import { IItem } from 'src/interfaces';
import { DetailContext } from './detail.context';

const INITIAL_STATE: IItem & any = {
  id: undefined,
  open: false,
  data: {},
  align: 'center',
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'REQUEST_PREVIEW':
      return {
        ...state,
        open: true,
        data: action.data,
        align: () => {
          if (action.id === 0 || action.id % 4 === 0) return 'flex-start';
          if ((action.id - 3) % 4 === 0) return 'flex-end';
          return 'center';
        },
      };
    case 'REQUEST_PREVIEW_CANCEL':
      return {
        ...state,
        open: false,
        align: 'center',
        data: {},
      };
    default:
      return state;
  }
}

export const DetailProvider: React.FC = ({ children }) => {
  const [detailState, detailDispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <DetailContext.Provider value={{ detailState, detailDispatch }}>
      {children}
    </DetailContext.Provider>
  );
};

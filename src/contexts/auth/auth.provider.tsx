import React, { useReducer } from 'react';
import { setAccessToken } from 'src/helper/accessToken';
import { getCookie, removeCookie, setCookie } from 'src/helper/session';
import { AuthContext } from './auth.context';

const isBrowser = typeof window !== 'undefined';
const userCookie = getCookie('Session');
const INITIAL_STATE = {
  isAuthenticated: isBrowser && !!userCookie,
  currentForm: 'signIn',
  user: (userCookie && JSON.parse(userCookie)) || {},
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'SIGNIN':
      return {
        ...state,
        currentForm: 'signIn',
      };
    case 'SIGNIN_SUCCESS':
      setAccessToken(action.token);
      setCookie('Session', action.userInfo);
      return {
        ...state,
        isAuthenticated: true,
        user: action.userInfo,
      };
    case 'SIGN_OUT':
      setAccessToken(null);
      removeCookie('Session');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'SIGNUP':
      return {
        ...state,
        currentForm: 'signUp',
      };
    case 'FORGOTPASS':
      return {
        ...state,
        currentForm: 'forgotPass',
      };
    default:
      return state;
  }
}

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [authState, authDispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>{children}</AuthContext.Provider>
  );
};

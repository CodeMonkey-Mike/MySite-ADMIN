import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useContext, useMemo } from 'react';
import { AuthContext } from 'src/contexts/auth/auth.context';
import { LOGOUT } from 'src/graphql/mutation/user.mutattion';

export const useAuth = () => {
  const router = useRouter();
  const { authState, authDispatch } = useContext<any>(AuthContext);
  const [UseLogout] = useMutation(LOGOUT);

  const onLogout = async () => {
    try {
      await UseLogout();
    } catch (_e) {
    } finally {
      authDispatch({ type: 'SIGN_OUT' });
      router.replace('/login');
    }
  };
  const isLoggedIn = useMemo(() => authState && authState.isAuthenticated, [authState]);
  const user = useMemo(() => authState && authState.user, [authState]);

  return {
    onLogout,
    isLoggedIn,
    user,
  };
};

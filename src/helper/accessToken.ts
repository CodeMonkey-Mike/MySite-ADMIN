let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  if (token) {
    accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('MN.accessToken', token);
    }
  } else {
    accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('MN.accessToken');
    }
  }
};

export const getAccessToken = (): string | null => {
  if (accessToken !== null) {
    return accessToken;
  } else {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('MN.accessToken') || null;
    } else {
      return null;
    }
  }
};

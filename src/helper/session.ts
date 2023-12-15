import cookie from 'js-cookie';
import nextCookie from 'next-cookies';

const cookie_duration = (remember_me: boolean): number =>
  Number(remember_me ? process.env.REMEMBER_ME_DURATION : process.env.NOT_REMEMBER_ME_DURATION) ||
  5;

export const getCookieFromServer = (ctx: any, key = 'koa:sess') => {
  const cookie = nextCookie(ctx);
  const token = cookie && cookie[key] ? cookie[key] : false;
  if (!token) {
    return null;
  }
  return token;
};

export const getCookie = (key: string) => {
  return cookie.get(key);
};

export const setCookie = (key: string, token: any, remember: boolean = false) => {
  cookie.set(key, token, { expires: cookie_duration(remember), sameSite: 'strict' });
};

export const removeCookie = (key: string) => {
  cookie.remove(key);
};

export const constants = {
  path: {
    backend: import.meta.env.VITE_BACKEND_URL,
    signIn: '/auth/sign-in',
  },

  names: {
    localStorageAccessToken: 'access_token',
    localStorageRefreshToken: 'refresh_token',
  },

  statusCodes: {
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
  },
};

export const constants = {
  path: {
    backend: import.meta.env.VITE_BACKEND_URL,
    signIn: '/auth/sign-in',
  },

  statusCodes: {
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
  },
};

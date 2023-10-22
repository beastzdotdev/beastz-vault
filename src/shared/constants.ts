export const constants = Object.freeze({
  path: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    verify: '/auth/acc-verify',
    verifyMessage: '/auth/acc-verify-message',

    backend: {
      url: import.meta.env.VITE_BACKEND_URL,
    },
  },
});

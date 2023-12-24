export const constants = Object.freeze({
  path: {
    profile: 'profile',

    signIn: 'auth/sign-in',
    signUp: 'auth/sign-up',
    authVerify: 'auth/verify',
    authUserBlocked: 'auth/user-blocked',
    authUserLocked: 'auth/user-locked',
    authUserNotVerified: 'auth/user-not-verified',
    authRecoverPassword: 'auth/user-recover-password',
    support: 'support',
    oops: 'oops',

    backend: {
      url: import.meta.env.VITE_BACKEND_URL,
    },
  },
});

/**
 * @description / beofre every route is needed for redirection
 */
export const constants = Object.freeze({
  path: {
    profile: '/profile',
    fileStructure: '/file-structure',
    guide: '/guide',

    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    authVerify: '/auth/verify',
    authUserBlocked: '/auth/user-blocked',
    authUserLocked: '/auth/user-locked',
    authUserNotVerified: '/auth/user-not-verified',
    authRecoverPassword: '/auth/user-recover-password',
    support: '/support',
    oops: '/oops',

    backend: {
      url: import.meta.env.VITE_BACKEND_URL,
    },
  },

  MAX_FILE_UPLOAD_SIZE_IN_MB: 30,
  MAX_FILE_COUNT: 1500,

  get MAX_FILE_UPLOAD_SIZE() {
    return this.MAX_FILE_UPLOAD_SIZE_IN_MB * 1024 * 1024; // ~30 MB in bytes
  },
});

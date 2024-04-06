/**
 * @description / beofre every route is needed for redirection
 */
export const constants = Object.freeze({
  SIZE: 1024, // 1kb

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

  MAX_FILE_UPLOAD_SIZE_IN_MB: 30, // max file upload for single file ~30mb
  MAX_FILE_COUNT: 150, // max file upload count from folder
  MAX_ALLOWED_TOTAL_SIZE_IN_GB: 30, // total allowed file size ~30 GB

  get MAX_FILE_UPLOAD_SIZE_BYTES() {
    return this.MAX_FILE_UPLOAD_SIZE_IN_MB * this.SIZE * this.SIZE; // ~30 MB in bytes
  },

  get MAX_ALLOWED_FILE_SIZE_BYTES() {
    return this.MAX_ALLOWED_TOTAL_SIZE_IN_GB * this.SIZE * this.SIZE * this.SIZE; // ~30 GB in bytes
  },
});

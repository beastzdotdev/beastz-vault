/**
 * @description / beofre every route is needed for redirection
 */
export const constants = Object.freeze({
  VERSION: "0.0.1",
  SIZE: 1024, // 1kb

  path: {
    profile: "/profile",
    fileStructure: "/file-structure",
    storage: "/storage",
    bin: "/bin",

    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    authVerify: "/auth/verify",
    authUserBlocked: "/auth/user-blocked",
    authUserLocked: "/auth/user-locked",
    authUserNotVerified: "/auth/user-not-verified",
    authRecoverPassword: "/auth/user-recover-password",
    guide: "/guide",
    support: "/support",
    supportTicketCreate: "/support/create",
    supportTicketDetail: "/support/:id",
    oops: "/oops",

    openEncryption: {
      mini: "/oe",
      full: "/open-encryption",
    },

    backend: {
      url: import.meta.env.VITE_BACKEND_URL,
    },
  },

  external: {
    document: {
      root: import.meta.env.VITE_DOCUMENT_URL,

      document(id: string | number, title: string) {
        return `${this.root}/document/${id}?title=${title}`;
      },

      get home() {
        return `${this.root}/home`;
      },
    },
  },

  ENCRYPTION_EXT: ".enc",
  MAX_FILE_UPLOAD_SIZE_IN_MB: 30, // max file upload for single file ~30mb
  MAX_FILE_COUNT: 150, // max file upload count from folder
  MAX_ALLOWED_TOTAL_SIZE_IN_GB: 30, // total allowed file size ~30 GB

  get MAX_FILE_UPLOAD_SIZE_BYTES() {
    return this.MAX_FILE_UPLOAD_SIZE_IN_MB * this.SIZE * this.SIZE; // ~30 MB in bytes
  },

  get MAX_ALLOWED_FILE_SIZE_BYTES() {
    return (
      this.MAX_ALLOWED_TOTAL_SIZE_IN_GB * this.SIZE * this.SIZE * this.SIZE
    ); // ~30 GB in bytes
  },
});

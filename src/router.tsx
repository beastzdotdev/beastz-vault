import { createBrowserRouter } from 'react-router-dom';
import { App } from './features/app';
import { Root } from './features/root/root.page';
import { ErrorPage } from './features/error/error.page';
import { TableTestPage } from './features/experimental/table-test.page';
import { AuthSignUpPage } from './features/auth/auth-sign-up.page';
import { ProfilePage } from './features/profile/profile.page';
import { TreeNodesTestPage } from './features/experimental/tree-node-test.page';
import { AuthUserNotVerifiedPage } from './features/auth/auth-user-not-verified.page';
import { AuthUserBlockedPage } from './features/auth/auth-user-blocked.page';
import { AuthUserLockedPage } from './features/auth/auth-user-locked.page';
import { UserSupportPage } from './features/user-support/user-support.page';
import { AuthVerifyPage } from './features/auth/auth-verify.page';
import { AuthRecoverPasswordPage } from './features/auth/auth-recover-password.page';
import { OopsPage } from './features/auth/oops.page';
import { EncryptionTestPage } from './features/experimental/encryption-test.page';
import { ExperimentalRootPage } from './features/experimental/root.page';
import { AuthSignInPage } from './features/auth/auth-sign-in.page';
import { rootLoader } from './features/root/root-loader';
import { TestRefreshFlowPage } from './features/experimental/test-refresh-flow.page';
import { FileStructurePage } from './features/file-structure/file-strucutre.page';
import { GuidePage } from './features/guide/guide.page';
import { CardListLoaderTestPage } from './features/experimental/card-list-loader-test-page';
import { constants } from './shared/constants';
import { StoragePage } from './features/storage/storage.page';
import { BinPage } from './features/bin/bin.page';
import { binLoader } from './features/bin/bin-loader';
import { appLoader } from './features/app-loaders';
import { UserSupportTicketDetailPage } from './features/user-support/user-support-ticket-detail.page';
import { UserSupportTicketCreatePage } from './features/user-support/user-support-ticket-create.page';
import { userSupportTicketDetailLoader } from './features/user-support/user-support-ticket-detail-loader';
import { userSupportTicketLoader } from './features/user-support/user-support-ticket-loader';
import { OpenEncryptionPage } from './features/open-encryption/open-encryption.page';
import { ModalTestPage } from './features/experimental/modal-test-page';

export const router = createBrowserRouter([
  // under / every page is under auth protection
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: appLoader,
    children: [
      {
        index: true,
        element: <Root />,
      },
      {
        path: constants.path.profile,
        element: <ProfilePage />,
      },
      {
        path: constants.path.fileStructure,
        element: <FileStructurePage />,
      },
      {
        path: constants.path.storage,
        element: <StoragePage />,
      },
      {
        path: constants.path.guide,
        element: <GuidePage />,
      },
      {
        path: constants.path.bin,
        element: <BinPage />,
        loader: binLoader,
      },
      {
        loader: userSupportTicketLoader,
        path: constants.path.support,
        element: <UserSupportPage />,
      },
      {
        path: constants.path.supportTicketCreate,
        element: <UserSupportTicketCreatePage />,
      },

      {
        loader: userSupportTicketDetailLoader,
        path: constants.path.supportTicketDetail,
        element: <UserSupportTicketDetailPage />,
      },
      {
        path: '/check-error',
        loader: rootLoader,
        element: <p>should not show</p>,
      },
    ],
  },

  // auth
  {
    path: constants.path.signIn,
    element: <AuthSignInPage />,
  },
  {
    path: constants.path.signUp,
    element: <AuthSignUpPage />,
  },
  {
    path: constants.path.authVerify,
    element: <AuthVerifyPage />,
  },
  {
    path: constants.path.authUserNotVerified,
    element: <AuthUserNotVerifiedPage />,
  },
  {
    path: constants.path.authUserBlocked,
    element: <AuthUserBlockedPage />,
  },
  {
    path: constants.path.authUserLocked,
    element: <AuthUserLockedPage />,
  },
  {
    path: constants.path.authRecoverPassword,
    element: <AuthRecoverPasswordPage />,
  },

  // open encryption
  {
    path: constants.path.openEncryption.full,
    element: <OpenEncryptionPage />,
  },
  {
    path: constants.path.openEncryption.mini,
    element: <OpenEncryptionPage />,
  },

  // error
  {
    path: constants.path.oops,
    element: <OopsPage />,
  },
  {
    path: 'experimental',
    element: <ExperimentalRootPage />,
    children: [
      {
        path: 'encryption',
        element: <EncryptionTestPage />,
      },
      {
        path: 'tree-node',
        element: <TreeNodesTestPage />,
      },
      {
        path: 'table',
        element: <TableTestPage />,
      },
      {
        path: 'test-refresh-flow',
        element: <TestRefreshFlowPage />,
      },
      {
        path: 'test-card-list-loader',
        element: <CardListLoaderTestPage />,
      },
      {
        path: 'modal-test',
        element: <ModalTestPage />,
      },
    ],
  },
]);

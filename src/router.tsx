import { createBrowserRouter } from 'react-router-dom';
import { App } from './features/app';
import { Root } from './features/root/root.page';
import { ErrorPage } from './features/error/error.page';
import { appLoader } from './features/app-loader';
import { TableTestPage } from './features/experimental/table-test.page';
import { AuthSignUpPage } from './features/auth/auth-sign-up.page';
import { ProfilePage } from './features/profile/profile.page';
import { TreeNodesTestPage } from './features/experimental/tree-node-test.page';
import { AuthUserNotVerifiedPage } from './features/auth/auth-user-not-verified.page';
import { AuthUserBlockedPage } from './features/auth/auth-user-blocked.page';
import { AuthUserLockedPage } from './features/auth/auth-user-locked.page';
import { SupportPage } from './features/support/support.page';
import { AuthVerifyPage } from './features/auth/auth-verify.page';
import { AuthRecoverPasswordPage } from './features/auth/auth-recover-password.page';
import { OopsPage } from './features/auth/oops.page';
import { EncryptionTestPage } from './features/experimental/encryption-test.page';
import { ExperimentalRootPage } from './features/experimental/root.page';
import { AuthSignInPage } from './features/auth/auth-sign-in.page';
import { constants } from './shared';
import { rootLoader } from './features/root/root-loader';
import { TestRefreshFlowPage } from './features/experimental/test-refresh-flow.page';
import { FileStructurePage } from './features/file-structure/file-strucutre.page';

export const router = createBrowserRouter([
  // under / every page is under auth protection
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: appLoader,
    children: [
      {
        errorElement: <p>Root error popupp</p>,
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
            path: '/check-error',
            loader: rootLoader,
            element: <p>should not show</p>,
          },
        ],
      },
    ],
  },
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
  {
    path: constants.path.support,
    element: <SupportPage />,
  },
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
    ],
  },
]);

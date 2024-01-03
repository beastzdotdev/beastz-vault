import { createBrowserRouter } from 'react-router-dom';
import { App } from './features/app';
import { Root } from './features/root/ui/root';
import { ErrorPage } from './features/error/ui/error';
import { appLoader } from './features/app-loader';
import { TableTest } from './features/experimental/ui/table-test';
import { AuthSignUp } from './features/auth/ui/auth-sign-up';
import { Profile } from './features/profile/ui/profile';
import { TreeNodesTest } from './features/experimental/ui/tree-node-test';
import { AuthUserNotVerified } from './features/auth/ui/auth-user-not-verified';
import { AuthUserBlockedPage } from './features/auth/ui/auth-user-blocked';
import { AuthUserLockedPage } from './features/auth/ui/auth-user-locked';
import { Support } from './features/support/ui/support';
import { AuthVerify } from './features/auth/ui/auth-verify';
import { AuthRecoverPassword } from './features/auth/ui/auth-recover-password';
import { Oops } from './features/auth/ui/oops';
import { EncryptionTest } from './features/experimental/ui/encryption-test';
import { ExperimentalRoot } from './features/experimental/ui/root';
import { AuthSignIn } from './features/auth/ui/auth-sign-in';
import { constants } from './shared';
import { rootLoader } from './features/root/root-loader';
import { TestRefreshFlow } from './features/experimental/ui/test-refresh-flow';
import { FileStructure } from './features/file-structure/ui/file-strucutre';

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
            element: <Profile />,
          },
          {
            path: constants.path.fileStructure,
            element: <FileStructure />,
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
    element: <AuthSignIn />,
  },
  {
    path: constants.path.signUp,
    element: <AuthSignUp />,
  },
  {
    path: constants.path.authVerify,
    element: <AuthVerify />,
  },
  {
    path: constants.path.authUserNotVerified,
    element: <AuthUserNotVerified />,
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
    element: <AuthRecoverPassword />,
  },
  {
    path: constants.path.support,
    element: <Support />,
  },
  {
    path: constants.path.oops,
    element: <Oops />,
  },
  {
    path: 'experimental',
    element: <ExperimentalRoot />,
    children: [
      {
        path: 'encryption',
        element: <EncryptionTest />,
      },
      {
        path: 'tree-node',
        element: <TreeNodesTest />,
      },
      {
        path: 'table',
        element: <TableTest />,
      },
      {
        path: 'test-refresh-flow',
        element: <TestRefreshFlow />,
      },
    ],
  },
]);

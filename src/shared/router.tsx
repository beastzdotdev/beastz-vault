import { createBrowserRouter } from 'react-router-dom';
import { Root } from '../routes/root';
import { Index } from '../routes';
import { ErrorPage } from '../features/error/ui/error';
import { rootLoader } from './loader';
import { Books } from '../routes/books';
import { AuthSignUp } from '../features/auth/ui/auth-sign-up';
import { Profile } from '../routes/profile';
import { Test } from '../routes/test';
import { constants } from './constants';
import { AuthSignIn } from '../features/auth';
import { AuthUserNotVerified } from '../features/auth/ui/auth-user-not-verified';
import { AuthUserBlockedPage } from '../features/auth/ui/auth-user-blocked';
import { AuthUserLockedPage } from '../features/auth/ui/auth-user-locked';
import { Support } from '../features/support/ui/support';
import { AuthVerify } from '../features/auth/ui/auth-verify';
import { AuthRecoverPassword } from '../features/auth/ui/auth-recover-password';
import { Oops } from '../features/auth/ui/oop';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'books',
        element: <Books />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'test',
        element: <Test />,
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
]);
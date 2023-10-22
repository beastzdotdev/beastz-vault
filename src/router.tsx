import { createBrowserRouter } from 'react-router-dom';
import Root from './routes/root';
import Index from './routes';
import ErrorPage from './routes/error';
import { rootLoader } from './loader';
import { Books } from './routes/books';
import { AuthSignUp } from './features/auth/ui/auth-sign-up';
import { Profile } from './routes/profile';
import { Test } from './routes/test';
import { constants } from './shared/constants';
import { AuthSignIn } from './features/auth';
import { AuthVerifyMessage } from './features/auth/ui/auth-verify-messages';

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
        // loader: booksLoader,
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
    path: constants.path.verifyMessage,
    element: <AuthVerifyMessage />,
  },
]);

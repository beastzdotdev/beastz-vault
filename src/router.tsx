import { createBrowserRouter } from 'react-router-dom';
import { booksLoader, rootLoader } from './loader';
import Root from './routes/root';
import Index from './routes';
import { AuthSignIn } from './routes/auth-sign-in';
import { Books } from './routes/books';
import ErrorPage from './routes/error';
import { AuthSignUp } from './routes/auth-sign-up';
import { Profile } from './routes/profile';
import { Test } from './routes/test';
import { constants } from './common/constants';

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
        loader: booksLoader,
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
    path: 'auth/sign-up',
    element: <AuthSignUp />,
  },
]);

import { createBrowserRouter } from 'react-router-dom';
import { booksLoader, rootLoader } from './loader';
import Root from './routes/root';
import Index from './routes';
import { Books } from './routes/books';
import ErrorPage from './routes/error';
import { AuthSignUp } from './routes/auth-sign-up';
import { Profile } from './routes/profile';
import { Test } from './routes/test';
import { constants } from './shared/constants';
import { AuthSignIn } from './features/auth';

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

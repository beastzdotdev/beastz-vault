import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { Book } from './store/store.type';

// export type RootLoaderType = {
//   user: User;
// };

export const rootLoader = async (_args: LoaderFunctionArgs) => {
  // const user = await new Promise<User | null>((res, _rej) => {
  //   onAuthStateChanged(
  //     auth,
  //     currentUser => {
  //       res(currentUser);
  //     },
  //     err => {
  //       console.log('='.repeat(20));
  //       console.log(err);
  //     }
  //   );
  // });

  // console.log('+++');
  // console.log(user);

  // if (!user) {
  //   return redirect('/auth/sign-in');
  // }

  return {
    message: 123,
  };
};

export const booksLoader = async (): Promise<{ books: Book[] }> => {
  const booksStr = localStorage.getItem('books');

  if (!booksStr) {
    return {
      books: [],
    };
  }

  const books = JSON.parse(booksStr) as Book[];

  return {
    books,
  };
};

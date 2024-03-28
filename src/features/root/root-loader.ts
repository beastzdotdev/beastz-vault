import { LoaderFunctionArgs } from 'react-router-dom';

export const rootLoader = async (_args: LoaderFunctionArgs) => {
  throw new Error('Testing root page error');
};

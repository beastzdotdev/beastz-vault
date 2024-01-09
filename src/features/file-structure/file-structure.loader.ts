import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { isUUID } from '../../shared';

/**
 * @description
 * ! Here _args.request.url will definitely have pathname of /file-structure so no need to check that
 */
export const fileStructureLoader = async (_args: LoaderFunctionArgs) => {
  const queryParams = new URL(_args.request.url).searchParams;
  const id = queryParams.get('id');

  if (id && id !== 'root' && !isUUID(id)) {
    throw new Error(); // router will handle this error
  }

  // if id not exists definitely add before loading ui
  if (!id) {
    const redirectUrl = new URL(_args.request.url);
    redirectUrl.searchParams.set('id', 'root');

    return redirect(redirectUrl.toString());
  }

  // fetch file-structure entity based on id

  return 'ok';
};

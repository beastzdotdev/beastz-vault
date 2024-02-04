import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { FileStructureApiService, getQueryParams, ioc, isUUID } from '../../shared';

/**
 * @description
 * ! Here _args.request.url will definitely have pathname of /file-structure so no need to check that
 */
export const fileStructureLoader = async (_args: LoaderFunctionArgs) => {
  const queryParams = getQueryParams<{ id?: string }>(_args.request.url);
  const id = queryParams.id;

  // 1. Validate url query parameters
  if (id && id !== 'root' && !isUUID(id)) {
    throw new Error(); // router will handle this error
  }

  // 2. if id not exists definitely add id as root before loading ui
  if (!id) {
    const redirectUrl = new URL(_args.request.url);
    redirectUrl.searchParams.set('id', 'root');

    return redirect(redirectUrl.toString());
  }

  const fileStructureApiService = ioc.getContainer().get(FileStructureApiService);

  // 3. if id is root handle root api call
  if (id === 'root') {
    const { data, error } = await fileStructureApiService.getRoot();

    //TODO uncomment this part when root call will be resolved and development will be done
    // if (error) {
    //   throw new Error('Sorry, something went wrong, pleas contact support');
    // }

    console.log('='.repeat(20) + '[Root data]');
    console.log(data);

    //TODO handle root response
    return 'ok';
  }

  // 4. else handle get by id of file structure item
  const { data, error } = await fileStructureApiService.getById(id);

  if (error) {
    throw new Error('Could not find item');
  }

  console.log('='.repeat(20) + '+++');
  console.log(data);

  return 'ok';
};

import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { FileStructureApiService, getQueryParams, ioc } from '../../shared';
import { SharedController } from '../shared/state/shared.controller';

/**
 * @description
 * ! Here _args.request.url will definitely have pathname of /file-structure so no need to check that
 */
export const fileStructureLoader = async (_args: LoaderFunctionArgs) => {
  const queryParams = getQueryParams<{ id?: string; root_parent_id?: number; parent_id?: number }>(
    _args.request.url
  );
  const { id, parent_id: parentId, root_parent_id: rootParentId } = queryParams;

  // only id and id === root
  // all three and id is not root

  const correctRouteParams =
    (id && id === 'root') || (id && parentId && rootParentId && id !== 'root');

  // 1. Validate url query parameters
  if (!correctRouteParams) {
    throw new Error(); // router will handle this error
  }

  // 2. if id not exists definitely add id as root before loading ui
  if (!id) {
    const redirectUrl = new URL(_args.request.url);
    redirectUrl.searchParams.set('id', 'root');

    return redirect(redirectUrl.toString());
  }

  const fileStructureApiService = ioc.getContainer().get(FileStructureApiService);
  const sharedController = ioc.getContainer().get(SharedController);

  // 3. if id is root handle root api call
  if (id === 'root') {
    const { data, error } = await fileStructureApiService.getOnlyRoot();

    if (error || !data) {
      throw new Error('Sorry, something went wrong, pleas contact support');
    }

    sharedController.setActiveFileStructureInBody(data);
    return 'ok';
  }

  // 4. else handle get by id of file structure item
  const { data, error } = await fileStructureApiService.getContentById(id);

  console.log('='.repeat(20));
  console.log(data);

  if (error || !data) {
    throw new Error('Could not find folder');
  }

  sharedController.setActiveFileStructureInBody(data);
  return 'ok';
};

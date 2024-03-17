import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { FileStructureApiService, getQueryParams, ioc } from '../../shared';
import { SharedController } from '../shared/state/shared.controller';
import { SharedStore } from '../shared/state/shared.store';

/**
 * @description
 * ! Here _args.request.url will definitely have pathname of /file-structure so no need to check that
 */
export const fileStructureLoader = async (_args: LoaderFunctionArgs) => {
  const queryParams = getQueryParams<{ id?: string; root_parent_id?: number }>(_args.request.url);
  const { id, root_parent_id: rootParentId } = queryParams;
  const fileStructureApiService = ioc.getContainer().get(FileStructureApiService);
  const sharedController = ioc.getContainer().get(SharedController);
  const sharedStore = ioc.getContainer().get(SharedStore);

  // 1. if id not exists definitely add id as root before loading ui
  if (!id) {
    const redirectUrl = new URL(_args.request.url);
    redirectUrl.searchParams.set('id', 'root');

    return redirect(redirectUrl.toString());
  }

  // 2. Validate url query parameters
  const correctRouteParams = !!((id && id === 'root') || (id && rootParentId && id !== 'root'));
  if (!correctRouteParams) {
    throw new Error(); // router will handle this error
  }

  // root content must always be set like if user is in deeply nested folder and user resets page
  const { data: rootData, error: rootDataError } = await fileStructureApiService.getContent();
  // console.log(JSON.stringify(rootData, null, 2));

  if (rootDataError || !rootData) {
    throw new Error('Sorry, something went wrong');
  }

  //! Always set root data when initial loading for sidebar
  sharedStore.setActiveRootFileStructure(rootData);

  // 3. if id is root then ignore because it is already set
  if (id === 'root') {
    sharedController.setFileStructureBodyFromRoot(rootData);
    return 'ok';
  }

  const parentId = parseInt(id);

  if (!parentId) {
    throw new Error('Sorry, something went wrong');
  }

  // 4. else handle get by id of file structure item (overrides only active file structure)
  const { data, error } = await fileStructureApiService.getContent(parentId);

  if (error || !data) {
    throw new Error('Sorry, something went wrong');
  }

  sharedController.setFileStructureBodyFromRoot(data);
  return 'ok';
};

import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { SharedController } from '../shared/state/shared.controller';
import { SharedStore } from '../shared/state/shared.store';
import { FileStructureApiService } from '../../shared/api';
import { getQueryParams } from '../../shared/helper';
import { ioc } from '../../shared/ioc';
import { RootFileStructure } from '../../shared/model';
import { AxiosApiResponse } from '../../shared/types';

/**
 * @description
 * ! Here _args.request.url will definitely have pathname of /file-structure so no need to check that
 */
export const fileStructureLoader = async (_args: LoaderFunctionArgs) => {
  const queryParams = getQueryParams<{
    id?: number | 'root';
    root_parent_id?: number;
    path?: string;
  }>(_args.request.url);
  const { id, root_parent_id: rootParentId, path } = queryParams;
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
  const correctRouteParams = !!(
    (id && id === 'root') ||
    (id && rootParentId && path && typeof id === 'number')
  );

  if (!correctRouteParams) {
    throw new Error(); // router will handle this error
  }

  let rootResponse: AxiosApiResponse<RootFileStructure[]>;

  // root content must always be set like if user is in deeply nested folder and user resets page
  if (typeof id === 'number' && id !== rootParentId) {
    rootResponse = await fileStructureApiService.getContent({
      rootParentId,
      focusParentId: id,
    });
  } else {
    rootResponse = await fileStructureApiService.getContent();
  }

  const { data: rootData, error: rootDataError } = rootResponse;

  if (rootDataError || !rootData) {
    throw new Error('Sorry, something went wrong');
  }

  //! Always set root data when initial loading for sidebar
  sharedStore.setActiveRootFileStructure(rootData);

  await sharedController.setAcitveFileInBody(id, rootData);
  return 'ok';
};

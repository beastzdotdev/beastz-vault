import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { SharedStore } from '../shared/state/shared.store';
import { FileStructureApiService } from '../../shared/api';
import { getQueryParams } from '../../shared/helper';
import { ioc } from '../../shared/ioc';
import { RootFileStructure } from '../../shared/model';
import { AxiosApiResponse } from '../../shared/types';
import { constants } from '../../shared/constants';
import { SharedController } from '../shared/state/shared.controller';

export type FSQueryParams = { id: 'root' } | { id: number; root_parent_id: number; path: string };

const getRootResponse = async (
  query: FSQueryParams
): Promise<AxiosApiResponse<RootFileStructure[]>> => {
  const fileStructureApiService = ioc.getContainer().get(FileStructureApiService);

  // root content must always be set like if user is in deeply nested folder and user resets page
  if (typeof query.id === 'number' && query.id !== query.root_parent_id) {
    return fileStructureApiService.getContent({ focusRootParentId: query.root_parent_id });
  }

  return fileStructureApiService.getContent();
};

export const selectFileStructure = (url: URL, query: FSQueryParams) => {
  if (url.pathname === constants.path.fileStructure) {
    const sharedController = ioc.getContainer().get(SharedController);
    const sharedStore = ioc.getContainer().get(SharedStore);

    sharedStore.setRouterParams(
      query.id,
      query.id === 'root' ? undefined : query.root_parent_id,
      query.id === 'root' ? undefined : query.path
    );
    sharedController.selectFolder(query);
  }
};

/**
 * @description
 * ! Here _args.request.url will definitely have pathname of /file-structure so no need to check that
 */
export const fileStructureLoader = async (_args: LoaderFunctionArgs) => {
  // console.log('Loading fs loader');

  const url = new URL(_args.request.url);

  // this variable check if call is from fs or other routes like /profile
  const isFSPath = url.pathname === constants.path.fileStructure;

  // if fspath go with standart fs loader if not then just assume that id is root
  const query: FSQueryParams = isFSPath
    ? getQueryParams<FSQueryParams>(_args.request.url)
    : { id: 'root' };

  // 1. if id not exists definitely add id as root before loading ui
  if (!query.id) {
    url.searchParams.set('id', 'root');
    return redirect(url.toString());
  }

  // 2. Validate url query parameters
  const correctRouteParams = !!(
    query.id === 'root' ||
    (typeof query.id === 'number' && query.id && query.root_parent_id && query.path)
  );

  if (!correctRouteParams) {
    throw new Error('Invalid url pleas go back home'); // router will handle this error
  }

  const sharedStore = ioc.getContainer().get(SharedStore);
  const fileStructureApiService = ioc.getContainer().get(FileStructureApiService);

  const [rootResponse, generalInfoResponse] = await Promise.all([
    getRootResponse(query),
    fileStructureApiService.getGeneralInfo(),
  ]);

  if (generalInfoResponse.error || !generalInfoResponse.data) {
    throw new Error('Sorry, something went wrong, general info');
  }

  sharedStore.setGeneralInfo(generalInfoResponse.data);

  if (rootResponse.error || !rootResponse.data) {
    throw new Error('Sorry, something went wrong');
  }

  //! Always set root data when initial loading for sidebar
  sharedStore.setActiveRootFileStructure(rootResponse.data);

  selectFileStructure(url, query);

  return 'ok';
};

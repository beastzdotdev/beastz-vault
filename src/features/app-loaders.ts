import { z } from 'zod';
import { runInAction } from 'mobx';
import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { ProfileController } from './profile/state/profile.controller';
import { ProfileStore } from './profile/state/profile.store';
import { SharedStore } from './shared/state/shared.store';
import { FileStructureApiService, UserApiService } from '../shared/api';
import { constants } from '../shared/constants';
import { ioc } from '../shared/ioc';
import { fileStructureLoader } from './file-structure/file-structure.loader';
import { getQueryParams } from '../shared/helper';
import { FSQueryParams } from '../shared/types';

let isCalledOne = false;

const RootRouteSchema = z.object({
  id: z.literal('root'),
});

const NonRootRouteSchema = z.object({
  id: z.number(),
  root_parent_id: z.number(),
  path: z.string(),
});

const setGeneralInfo = async () => {
  const { data, error } = await ioc.getContainer().get(FileStructureApiService).getGeneralInfo();

  if (error || !data) {
    throw new Error('Sorry, something went wrong, general info');
  }

  ioc.getContainer().get(SharedStore).setGeneralInfo(data);
};

const setRootData = async () => {
  const { data: fsRootData, error: fsRootError } = await ioc
    .getContainer()
    .get(FileStructureApiService)
    .getContent();

  if (fsRootError || !fsRootData) {
    throw new Error('Sorry, could not data');
  }

  ioc.getContainer().get(SharedStore).setActiveRootFileStructure(fsRootData);
};

export const appOneTimeLoader = async (_args: LoaderFunctionArgs) => {
  if (isCalledOne) {
    return;
  }

  const profileController = ioc.getContainer().get(ProfileController);
  const profileStore = ioc.getContainer().get(ProfileStore);
  const sharedStore = ioc.getContainer().get(SharedStore);
  const userApiService = ioc.getContainer().get(UserApiService);

  await runInAction(async () => {
    if (!profileStore.user) {
      const { data, error } = await userApiService.getCurrentUser();

      if (error || !data) {
        //TODO instead of throwing errors get what is error set Render to false and show appropriate message
        throw new Error('Something occured, please try signing in again');
      }

      // Api call will make sure whether user is locked, blocked or not verified
      sharedStore.setShouldRender(true);
      profileController.setUser(data);
    }
  });

  await Promise.all([
    //
    setGeneralInfo(),
    setRootData(), //! Always set root fsRootData when initial loading for sidebar
  ]);

  isCalledOne = true;
};

export const appLoader = async (_args: LoaderFunctionArgs) => {
  await appOneTimeLoader(_args);

  const sharedStore = ioc.getContainer().get(SharedStore);

  // console.log('called app loader', _args.request.url);

  // fs is file_structure
  // query params for fs will only exist like ?id=root or ?id=number&root_parent_id=number&path=something

  const url = new URL(_args.request.url);

  //! For root router
  if (url.pathname === '/') {
    url.pathname = constants.path.fileStructure;
    url.searchParams.set('id', 'root');
    return redirect(url.toString());
  }

  //! For non fs router
  if (url.pathname !== constants.path.fileStructure) {
    sharedStore.toggleAllSelected(false);
    return fileStructureLoader({ id: 'root' });
  }

  //! For fs router
  const query = getQueryParams<FSQueryParams>(_args.request.url);

  // id must always exist if not redirect to id of root
  if (!query.id) {
    url.searchParams.set('id', 'root');
    return redirect(url.toString());
  }

  if (
    (query.id === 'root' && !RootRouteSchema.safeParse(query).success) ||
    (query.id !== 'root' && !NonRootRouteSchema.safeParse(query).success)
  ) {
    throw new Error('Invalid url please go back home');
  }

  return fileStructureLoader(query);
};

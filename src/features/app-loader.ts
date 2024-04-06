import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { runInAction } from 'mobx';
import { ProfileController } from './profile/state/profile.controller';
import { ProfileStore } from './profile/state/profile.store';
import { SharedStore } from './shared/state/shared.store';
import { UserApiService } from '../shared/api';
import { constants } from '../shared/constants';
import { ioc } from '../shared/ioc';
import { fileStructureLoader } from './file-structure/file-structure.loader';

export const appLoader = async (_args: LoaderFunctionArgs) => {
  const profileController = ioc.getContainer().get(ProfileController);
  const profileStore = ioc.getContainer().get(ProfileStore);
  const sharedStore = ioc.getContainer().get(SharedStore);
  const userApiService = ioc.getContainer().get(UserApiService);

  await runInAction(async () => {
    if (!profileStore.user) {
      //TODO get error and show appropriate messages, handle error
      const { data } = await userApiService.getCurrentUser();

      // Api call will make sure whether user is locked, blocked or not verified
      sharedStore.setShouldRender(data ? true : false);

      if (data) {
        profileController.setUser(data);
      }
    }
  });

  const url = new URL(_args.request.url);

  // if request url is root redirect to {constants.path.fileStructure} route
  if (url.pathname === '/') {
    url.pathname = constants.path.fileStructure;
    return redirect(url.toString());
  }

  // for other routes like profile, ...
  return fileStructureLoader(_args);
};

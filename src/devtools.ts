import { injectStores } from '@mobx-devtools/tools';
import { SharedStore } from './features/shared/state/shared.store';
import { ProfileStore } from './features/profile/state/profile.store';
import { ioc } from './shared/ioc';

if (import.meta.env.DEV) {
  const sharedStore = ioc.getContainer().get(SharedStore);
  const profileStore = ioc.getContainer().get(ProfileStore);

  injectStores({
    sharedStore,
    profileStore,
  });
}

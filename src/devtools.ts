import { injectStores } from '@mobx-devtools/tools';
import { SharedStore } from './features/shared/state/shared.store';
import { ProfileStore } from './features/profile/state/profile.store';
import { ioc } from './shared/ioc';
import { BinStore } from './features/bin/state/bin.store';

if (import.meta.env.DEV) {
  const sharedStore = ioc.getContainer().get(SharedStore);
  const profileStore = ioc.getContainer().get(ProfileStore);
  const binStore = ioc.getContainer().get(BinStore);

  injectStores({
    sharedStore,
    profileStore,
    binStore,
  });
}

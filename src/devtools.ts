import { injectStores } from '@mobx-devtools/tools';
import { SharedStore } from './features/shared/state/shared.store';
import { ProfileStore } from './features/profile/state/profile.store';
import { ioc } from './shared/ioc';
import { BinStore } from './features/bin/state/bin.store';
import { FileViewStore } from './features/shared/widgets/file-view/file-view-store';

if (import.meta.env.DEV) {
  const sharedStore = ioc.getContainer().get(SharedStore);
  const profileStore = ioc.getContainer().get(ProfileStore);
  const binStore = ioc.getContainer().get(BinStore);
  const fileViewStore = ioc.getContainer().get(FileViewStore);

  injectStores({
    sharedStore,
    profileStore,
    binStore,
    fileViewStore,
  });
}

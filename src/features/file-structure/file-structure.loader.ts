import { runInAction } from 'mobx';
import { SharedStore } from '../shared/state/shared.store';
import { FileStructureApiService } from '../../shared/api';
import { ioc } from '../../shared/ioc';
import { SharedController } from '../shared/state/shared.controller';
import { FSQueryParams } from '../../shared/types';

const setActiveBodyFileStructure = async (id: number) => {
  const { data, error } = await ioc
    .getContainer()
    .get(FileStructureApiService)
    .getContent({ parentId: id });

  if (error || !data) {
    throw new Error('Sorry, could not find file/folder');
  }

  ioc.getContainer().get(SharedStore).setActiveBodyFileStructure(data);
};

export const fileStructureLoader = async (query: FSQueryParams) => {
  const sharedController = ioc.getContainer().get(SharedController);
  const sharedStore = ioc.getContainer().get(SharedStore);

  if (query.id === 'root') {
    // select nothing on sidebar and fetch nothing for fs
    // just deselect all, collapse all and select root data in body

    sharedStore.toggleAllExpand(false);
    sharedStore.toggleAllSelected(false);

    runInAction(() => {
      const newCopied = sharedStore.activeRootFileStructure.map(e => e.copyIgnoreChildren());
      sharedStore.setActiveBodyFileStructure(newCopied);
    });

    return 'ok';
  }

  await setActiveBodyFileStructure(query.id);

  sharedController.selectFolderSidebar(query.id, query.path);

  return 'ok';
};

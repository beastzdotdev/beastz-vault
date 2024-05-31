import { useEffect } from 'react';
import { useInjection } from 'inversify-react';

import { bus } from '../../../../shared/bus';
import { FileViewStore } from './file-view-store';
import { FileViewModal } from './file-view-modal';

export const FileViewModalListener = () => {
  const fileViewStore = useInjection(FileViewStore);

  useEffect(
    () => {
      bus.addListener('show-file', ({ item, isInBin }) => {
        fileViewStore.setIsModalOpen(true);
        fileViewStore.setIsInBin(isInBin);
        fileViewStore.setItem(item);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <FileViewModal />
    </>
  );
};

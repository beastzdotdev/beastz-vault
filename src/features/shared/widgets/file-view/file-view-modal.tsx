import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useInjection } from 'inversify-react';
import { FileStructureApiService } from '../../../../shared/api';
import { differentiate, openLink } from '../../../../shared/helper';
import { toast } from '../../../../shared/ui';
import { FileStructureViewModalWidget } from '../../../../widgets/file-structure-view-modal.widget';
import { FileViewStore } from './file-view-store';
import { RootFileStructure } from '../../../../shared/model';
import { FileViewModalBody } from './widgets/file-view-modal-body';

export const FileViewModal = observer(() => {
  const fileViewStore = useInjection(FileViewStore);
  const fileStructureApiService = useInjection(FileStructureApiService);

  const type = useMemo(
    () => differentiate(fileViewStore.item?.mimeType),
    [fileViewStore.item?.mimeType]
  );

  const title = useMemo(
    () =>
      fileViewStore.item?.title +
      (fileViewStore.item?.fileExstensionRaw ?? '') +
      (fileViewStore.isInBin ? ' - Bin' : ''),
    [fileViewStore.isInBin, fileViewStore.item?.fileExstensionRaw, fileViewStore.item?.title]
  );

  const download = useCallback(
    async (item: RootFileStructure) => {
      const { error } = await fileStructureApiService.downloadById(item.id);
      if (error) {
        toast.error(error?.message ?? 'Sorry, something went wrong');
        return;
      }
    },
    [fileStructureApiService]
  );

  return (
    <>
      <FileStructureViewModalWidget
        item={fileViewStore.item}
        isOpen={fileViewStore.isModalOpen}
        onClose={() => fileViewStore.setIsModalOpen(false)}
        title={title}
        showPrintButton={type === 'image'}
        showDownloadButton={!fileViewStore.isInBin}
        showLinkButton={!fileViewStore.isInBin}
        onPrint={() => window.print()}
        onDownload={item => download(item)}
        onLink={item => openLink(item.absRelativePath)}
      >
        <FileViewModalBody item={fileViewStore.item} />
      </FileStructureViewModalWidget>
    </>
  );
});

import { useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Dialog } from '@blueprintjs/core';

import { useInjection } from 'inversify-react';
import { FileStructureApiService } from '../../../../shared/api';
import { getFileStructureUrlParams } from '../../helper/get-url-params';
import { cleanFiles, validateFileSize } from '../../helper/validate-file';
import { toast } from '../../../../shared/ui';
import { SharedController } from '../../state/shared.controller';
import { TextFileEditor, TextFileEditorOnSaveParams } from '../../../../widgets/text-editor';

type Params = {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
};

export const CreateFileDialog = observer(({ isOpen, toggleIsOpen }: Params) => {
  const fileStructureApiService = useInjection(FileStructureApiService);
  const sharedController = useInjection(SharedController);

  const store = useLocalObservable(() => ({
    loading: false,

    setLoading(value: boolean) {
      this.loading = value;
    },

    clear() {
      this.loading = false;
    },
  }));

  const closeDialog = useCallback(() => {
    store.clear();
    toggleIsOpen(false);
  }, [store, toggleIsOpen]);

  const saveFile = useCallback(
    async (params: TextFileEditorOnSaveParams) => {
      const { realTitle, replace, text } = params;

      store.setLoading(true);

      const { parentId, rootParentId } = getFileStructureUrlParams();
      const file = new File([text], realTitle, { type: 'text/plain' });

      if (!validateFileSize([file])) {
        store.setLoading(false);
        return;
      }

      const sanitizedFiles = cleanFiles([file]);

      if (!sanitizedFiles.length) {
        store.setLoading(false);
        return;
      }

      if (!replace) {
        const { data: duplicateData, error } = await fileStructureApiService.getDuplicateStatus({
          items: sanitizedFiles.map(() => ({ title: realTitle, mimeTypeRaw: 'text/plain' })),
          isFile: true,
          parentId,
        });

        if (error) {
          toast.error(error?.message || 'Sorry, something went wrong');
          store.setLoading(false);
          return;
        }

        if (duplicateData?.find(e => e.title === file.name)?.hasDuplicate) {
          toast.showDefaultMessage('Diplicate name detected, please use another one');
          store.setLoading(false);
          return;
        }
      }

      const { data, error: uploadError } = await fileStructureApiService.uploadFile({
        file: file,
        keepBoth: !replace,
        parentId,
        rootParentId,
      });

      if (uploadError) {
        toast.error(uploadError?.message || 'Sorry, something went wrong');
        store.setLoading(false);
        return;
      }

      sharedController.createFileStructureInState(data!, replace);

      closeDialog();
    },
    [closeDialog, fileStructureApiService, sharedController, store]
  );

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={() => closeDialog()}
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
        transitionDuration={0}
        enforceFocus
        className="!shadow-none relative w-[900px]"
      >
        <TextFileEditor loading={store.loading} onSave={saveFile} onClose={() => closeDialog()} />
      </Dialog>
    </>
  );
});

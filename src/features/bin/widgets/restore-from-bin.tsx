import { Dialog, DialogBody, DialogFooter, Button, Intent } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { SimpleFileStructureTree } from '../../../widgets/simple-file-structure-tree';
import { FileStructureApiService } from '../../../shared/api';
import { ExceptionMessageCode } from '../../../shared/enum';
import { toast } from '../../../shared/ui';
import { sleep } from '../../../shared/helper';
import { ClientApiError } from '../../../shared/errors';

type Params = {
  selectedIds: number[];
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
};

export const RestoreFromBin = ({ selectedIds, isOpen, toggleIsOpen }: Params) => {
  const fileStructureApiService = useInjection(FileStructureApiService);
  const store = useLocalObservable(() => ({
    id: null as number | null,

    setSelectedSingle(id: number | null) {
      this.id = id;
    },

    clear() {
      this.id = null;
    },
  }));

  const onError = (error?: ClientApiError) => {
    if (error?.message === ExceptionMessageCode.FS_SAME_NAME) {
      toast.error('File/Folder with same name exists already');
    } else {
      toast.error(error?.message || 'Sorry, something went wrong');
    }

    store.clear();
    toggleIsOpen(false); // will cause rerender for bin
  };

  const onClickingRestoreSaveButton = async () => {
    const selectedFsId = selectedIds[0]; //TODO in fututre multiple ids

    const startTime = new Date(); // Start time
    const { data, error } = await fileStructureApiService.restoreFromBin(selectedFsId, {
      newParentId: store.id,
    });
    const endTime = new Date(); // Calculate time taken

    // this is necessary because if axios took less than 200ms animation seems weird
    if (endTime.getTime() - startTime.getTime() < 200) {
      // add another 400 ms waiting
      await sleep(400);
    }

    if (error || !data) {
      onError(error);
      return;
    }

    window.location.reload(); //TODO here we should not refresh, we should refresh state
  };

  useEffect(() => {
    if (!isOpen) {
      store.clear();
    }
  }, [isOpen, store]);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title="Choose Location"
        onClose={() => toggleIsOpen(false)}
        isCloseButtonShown
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
      >
        <div
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onClickingRestoreSaveButton();
            }
          }}
        >
          <DialogBody>
            <div style={{ maxHeight: 400 }}>
              <SimpleFileStructureTree
                onSelect={node => store.setSelectedSingle(node?.id ?? null)}
              />
            </div>
          </DialogBody>

          <DialogFooter
            minimal
            actions={
              <>
                <Button onClick={() => toggleIsOpen(false)}>Close</Button>
                <Button intent={Intent.PRIMARY} onClick={() => onClickingRestoreSaveButton()}>
                  Save
                </Button>
              </>
            }
          />
        </div>
      </Dialog>
    </>
  );
};

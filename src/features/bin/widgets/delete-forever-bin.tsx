import { Intent, Alert } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FileStructureApiService } from '../../../shared/api';
import { toast } from '../../../shared/ui';
import { sleep } from '../../../shared/helper';
import { ClientApiError } from '../../../shared/errors';

type Params = {
  selectedIds: number[];
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
};

export const DeleteForeverBin = observer(({ selectedIds, isOpen, toggleIsOpen }: Params) => {
  const fileStructureApiService = useInjection(FileStructureApiService);
  const store = useLocalObservable(() => ({
    id: null as number | null,
    isLoading: false,

    setSelectedSingle(id: number | null) {
      this.id = id;
    },

    setIsLoading(value: boolean) {
      this.isLoading = value;
    },

    clear() {
      this.id = null;
      this.isLoading = false;
    },
  }));

  const onError = (error?: ClientApiError) => {
    toast.error(error?.message || 'Sorry, something went wrong');
    store.clear();
    toggleIsOpen(false); // will cause rerender for bin
  };

  const onClickingForeverDeleteButton = async () => {
    const selectedFsId = selectedIds[0]; //TODO in fututre multiple ids

    store.setIsLoading(true);

    const startTime = new Date(); // Start time
    const { data, error } = await fileStructureApiService.deleteForeverFromBin(selectedFsId);
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
      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Confirm"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={isOpen}
        loading={store.isLoading}
        onCancel={() => toggleIsOpen(false)}
        onConfirm={() => onClickingForeverDeleteButton()}
        canOutsideClickCancel
      >
        <p>Are you sure you want to forever delete ? You won't be able to restore it</p>
      </Alert>
    </>
  );
});

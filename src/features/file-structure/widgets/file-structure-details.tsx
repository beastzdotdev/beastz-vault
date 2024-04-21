import moment from 'moment';
import { Drawer, Classes, H3, Button } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { observer, useLocalObservable } from 'mobx-react-lite';

import { useCallback, useEffect } from 'react';
import { FileStructureApiService } from '../../../shared/api';
import { ExceptionMessageCode } from '../../../shared/enum';
import { toast } from '../../../shared/ui';
import { formatSize, getColorByBgColor, sleep } from '../../../shared/helper';
import { ClientApiError } from '../../../shared/errors';
import { RootFileStructure } from '../../../shared/model';

type Params = {
  selectedNodes: RootFileStructure[];
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  isInBin: boolean;
};

export const FileStructureDetails = observer(
  ({ selectedNodes, isOpen, toggleIsOpen, isInBin }: Params) => {
    const fileStructureApiService = useInjection(FileStructureApiService);

    const store = useLocalObservable(() => ({
      node: null as RootFileStructure | null, //TODO multi

      setFetchedNode(value: RootFileStructure | null) {
        this.node = value;
      },

      clear() {
        this.node = null;
      },
    }));

    const onError = useCallback(
      (error?: ClientApiError) => {
        if (error?.message === ExceptionMessageCode.FS_SAME_NAME) {
          toast.error('File/Folder with same name exists already');
        } else {
          toast.error(error?.message || 'Sorry, something went wrong');
        }

        store.clear();

        toggleIsOpen(false); // will cause rerender for bin
      },
      [store, toggleIsOpen]
    );

    useEffect(() => {
      const run = async () => {
        const startTime = new Date(); // Start time
        const { data, error } = await fileStructureApiService.getDetails({
          ids: selectedNodes.map(e => e.id),
          isInBin,
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

        store.setFetchedNode(data[0]);
      };

      if (!isOpen) {
        store.clear();
      } else {
        run();
      }
    }, [fileStructureApiService, isInBin, isOpen, onError, selectedNodes, store]);

    return (
      <>
        <Drawer
          isOpen={isOpen}
          onClose={() => toggleIsOpen(false)}
          canOutsideClickClose
          canEscapeKeyClose
          shouldReturnFocusOnClose
          enforceFocus
          position="right"
        >
          <div className={`${Classes.DIALOG_BODY} shadow-none`}>
            <H3 className="font-extralight">
              {selectedNodes[0]?.isFile ? 'File' : 'Folder' + ' Details'}
              {isInBin && ' - Bin'}
            </H3>

            <div></div>

            <div className="flex justify-between mt-3">
              <p className="font-bold">Title</p>
              <p>{store.node?.title}</p>
            </div>

            {store.node?.isFile && (
              <>
                <div className="flex justify-between mt-3">
                  <p className="font-bold">File extension</p>
                  <p>{store.node?.fileExstensionRaw}</p>
                </div>
                <div className="flex justify-between mt-3">
                  <p className="font-bold">Mimetype</p>
                  <p>{store.node?.mimeType}</p>
                </div>
                <div className="flex justify-between mt-3">
                  <p className="font-bold">Mimetype raw</p>
                  <p>{store.node?.mimeTypeRaw}</p>
                </div>
              </>
            )}

            <div className="flex justify-between mt-3">
              <p className="font-bold">Modifiet at</p>
              <p>
                {moment(store.node?.lastModifiedAt).calendar()}
                <span className="font-bold ml-2">
                  {moment(store.node?.lastModifiedAt).format('L')}
                </span>
              </p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="font-bold">Created at</p>
              <p>
                {moment(store.node?.createdAt).calendar()}
                <span className="font-bold ml-2">{moment(store.node?.createdAt).format('L')}</span>
              </p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="font-bold">Shared</p>
              <p>{'No'}</p>
            </div>

            <div className="flex justify-between mt-3">
              <p className="font-bold">Is encrypted</p>
              <p>{store.node?.isEncrypted ? 'Yes' : 'No'}</p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="font-bold">Is editable</p>
              <p>{store.node?.isEditable ? 'Yes' : 'No'}</p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="font-bold">Is locked</p>
              <p>{store.node?.isLocked ? 'Yes' : 'No'}</p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="font-bold">Size</p>
              <p>{formatSize(store.node?.sizeInBytes ?? 0)}</p>
            </div>
            <div className="flex justify-between mt-3">
              <p className="font-bold">Path</p>
              <p>{store.node?.path}</p>
            </div>

            <div className="flex justify-between mt-3">
              <p>Color</p>
              <Button
                className="border-[0.5px] border-solid border-white border-opacity-35 w-36 hover:scale-105 transition-transform transform active:scale-100 active:duration-75"
                onClick={() => {
                  navigator.clipboard.writeText(store?.node?.color ?? '');
                  toast.showMessage('Copied to clipboard');
                }}
                style={{
                  backgroundColor: store?.node?.color ?? undefined,
                  filter: 'saturate(130%)',
                  color: getColorByBgColor(store?.node?.color ?? null) ?? undefined,
                }}
              >
                Active: {store?.node?.color ?? 'none'}
              </Button>
            </div>
          </div>
        </Drawer>
      </>
    );
  }
);

import {
  Button,
  Dialog,
  DialogBody,
  H2,
  H3,
  Icon,
  NonIdealState,
  NonIdealStateIconSize,
} from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useMemo } from 'react';
import { RootFileStructure } from '../../../shared/model';
import { constants } from '../../../shared/constants';
import { differentiate } from '../../../shared/helper';

type Params = {
  selectedNode: RootFileStructure;
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  isInBin: boolean;
  binFsPath?: string;
};

export const FileStructureFileView = observer(
  ({ selectedNode, isOpen, toggleIsOpen, isInBin, binFsPath }: Params) => {
    console.log('selected node', selectedNode);

    const store = useLocalObservable(() => ({
      type: differentiate(selectedNode.mimeType),
    }));

    const getFileUrl = useMemo(() => {
      const location = isInBin ? '/user-bin' : '/user-content';
      const path = isInBin ? binFsPath : selectedNode.path;

      return constants.path.backend.url + location + path;
    }, [binFsPath, isInBin, selectedNode.path]);

    return (
      <>
        <Dialog
          isOpen={isOpen}
          onClose={() => toggleIsOpen(false)}
          canOutsideClickClose
          canEscapeKeyClose
          shouldReturnFocusOnClose
          transitionDuration={0}
          enforceFocus
          className="shadow-none fixed top-0 left-0 bottom-0 m-0 right-0 w-full h-full !bg-transparent overflow-hidden select-none"
        >
          <DialogBody className="max-h-none flex flex-col">
            <div className="pb-5 flex justify-between">
              <div className="flex items-center">
                <H3 className="font-extralight m-0 pl-3">
                  {selectedNode.title + (selectedNode?.fileExstensionRaw ?? '')}
                  {isInBin && ' - Bin'}
                </H3>
              </div>

              <div>
                {store.type === 'image' && (
                  <Button
                    outlined
                    className="rounded-full mr-4"
                    icon="print"
                    onClick={() => window.print()}
                  >
                    Print
                  </Button>
                )}
                <Button outlined className="rounded-full mr-4" icon="download">
                  Download
                </Button>
                <Button
                  icon="link"
                  className="rounded-full mr-2"
                  outlined
                  onClick={() => window.open(getFileUrl, '_blank')}
                />
                <Button
                  icon="cross"
                  className="rounded-full"
                  outlined
                  onClick={() => toggleIsOpen(false)}
                />
              </div>
            </div>

            <div
              className="flex-1 overflow-hidden flex justify-center"
              onClick={() => {
                if (store.type === 'image' || store.type === 'other') {
                  toggleIsOpen(false);
                }
              }}
            >
              {/* Start */}
              {store.type === 'other' && (
                <>
                  <NonIdealState
                    title={
                      <H2 className="font-extralight !text-neutral-50">
                        Sorry, file type not supported
                      </H2>
                    }
                    className="xxxs"
                    layout="horizontal"
                    iconMuted={false}
                    description={
                      <div>
                        <p>Try in another link</p>
                        <Button
                          outlined
                          className="rounded-full mt-4"
                          icon="link"
                          onClick={() => window.open(getFileUrl, '_blank')}
                        >
                          Open
                        </Button>
                      </div>
                    }
                    icon={
                      <Icon
                        icon="issue"
                        size={NonIdealStateIconSize.STANDARD}
                        className="text-neutral-50"
                      />
                    }
                  />
                </>
              )}

              {store.type === 'image' && (
                <>
                  <img
                    id="focused-for-print"
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      aspectRatio: '16 / 9',
                    }}
                    src={getFileUrl}
                    alt="Image not loaded, sorry"
                  />
                </>
              )}

              {store.type === 'audio' && (
                <>
                  <div className="flex items-center">
                    <audio controls src={getFileUrl} />
                  </div>
                </>
              )}

              {store.type === 'video' && (
                <>
                  <video controls src={getFileUrl} disablePictureInPicture />
                </>
              )}

              {store.type === 'text' && (
                <>
                  <p>text</p>
                </>
              )}

              {/* End */}
            </div>
          </DialogBody>
        </Dialog>
      </>
    );
  }
);

// const fileStructureApiService = useInjection(FileStructureApiService);

// const onError = useCallback(
//   (error?: ClientApiError) => {
//     if (error?.message === ExceptionMessageCode.FS_SAME_NAME) {
//       toast.error('File/Folder with same name exists already');
//     } else {
//       toast.error(error?.message || 'Sorry, something went wrong');
//     }

//     store.clear();

//     toggleIsOpen(false); // will cause rerender for bin
//   },
//   [store, toggleIsOpen]
// );

// useEffect(() => {
//   const run = async () => {
//     const startTime = new Date(); // Start time
//     const { data, error } = await fileStructureApiService.getDetails({
//       ids: selectedNodes.map(e => e.id),
//       isInBin,
//     });
//     const endTime = new Date(); // Calculate time taken

//     // this is necessary because if axios took less than 200ms animation seems weird
//     if (endTime.getTime() - startTime.getTime() < 200) {
//       // add another 400 ms waiting
//       await sleep(400);
//     }

//     if (error || !data) {
//       onError(error);
//       return;
//     }

//     store.setFetchedNode(data[0]);
//   };

//   if (!isOpen) {
//     store.clear();
//   } else {
//     run();
//   }
// }, [fileStructureApiService, isInBin, isOpen, onError, selectedNodes, store]);

import { ToastProps, Intent, Spinner, Card, CardList, Icon, Button } from '@blueprintjs/core';
import { v4 as uuid } from 'uuid';
import { ChangeEvent, useCallback, useState } from 'react';
import { validateFileSize } from '../../helper/validate-file';
import { FileStructureApiService, fileContentProgressToast, sleep } from '../../../../shared';
import { useInjection } from 'inversify-react';
import { getFileStructureUrlParams } from '../../helper/get-url-params';
import { DuplicateNameDialogWidget } from '../duplicate-name-dialog/duplicate-name-dialog';
import { FileUploadAtomicStore } from './file-upload-atomic-store';
import { observer } from 'mobx-react-lite';

const progressToastProps: Omit<ToastProps, 'message'> = {
  className: 'only-for-file-upload',
  isCloseButtonShown: false,
  intent: Intent.NONE,
  timeout: 10000000,
};

export const FileUploadItem = observer(
  ({ inputRef }: { inputRef: React.RefObject<HTMLInputElement> }): React.JSX.Element => {
    const fileStructureApiService = useInjection(FileStructureApiService);
    const fileUploadAtomicStore = useInjection(FileUploadAtomicStore);
    const [isDuplicateNameDialogOpen, setDuplicateNameDialogOpen] = useState(false);

    const start = useCallback(async () => {
      if (!fileUploadAtomicStore.data.length) {
        return;
      }

      const totalLength = fileUploadAtomicStore.data.length;

      const { parentId, rootParentId } = getFileStructureUrlParams();

      const key = fileContentProgressToast.show({
        message: (
          <div>
            <div className="flex justify-between items-center my-2 px-3">
              <p className="font-bold">Uploading {totalLength} files</p>

              <Button icon="cross" minimal className="invisible pointer-events-none" />
            </div>

            <CardList bordered={false} compact style={{ maxHeight: '225px' }}>
              {fileUploadAtomicStore.data.map(e => (
                <Card interactive={false} className="flex justify-between" key={e.id}>
                  <p>{e.file.name}</p>
                  <Spinner size={20} intent={Intent.PRIMARY} className="ml-5" />
                </Card>
              ))}
            </CardList>
          </div>
        ),
        ...progressToastProps,
      });

      const maxCount = 2;
      const reminder = totalLength % maxCount;
      const queue: { file: File; id: string }[] = [];
      const finishedUploadedFiles: { isSuccess: boolean; file: File; id: string }[] = [];

      let totalUploadCount = 0;

      // start batch upload
      for (const obj of fileUploadAtomicStore.data) {
        queue.push(obj);

        if (
          queue.length === maxCount ||
          (reminder !== 0 && totalUploadCount === totalLength - reminder)
        ) {
          for (const queueItem of queue) {
            const foundItem = fileUploadAtomicStore.duplicates.find(
              e => e.title === queueItem.file.name
            );

            const { error } = await fileStructureApiService.uploadFile({
              file: queueItem.file,

              // if file does not have duplicate then does not matter what modal duplicate choice says
              // we need to send replace because new file is created
              keepBoth: !foundItem?.hasDuplicate ? false : fileUploadAtomicStore.keepBoth,
              parentId,
              rootParentId,
            });

            finishedUploadedFiles.push({
              id: queueItem.id,
              file: queueItem.file,
              isSuccess: !error,
            });

            // if (data) {
            //   sharedController.push();
            // }
          }

          totalUploadCount += queue.length === maxCount ? maxCount : reminder; // this is for internal use only (unlike in folders upload)

          fileContentProgressToast.show(
            {
              message: (
                <div>
                  <div className="flex justify-between items-center my-2 px-3">
                    <p className="font-bold">Uploading {totalLength} files</p>

                    <Button icon="cross" minimal className="invisible pointer-events-none" />
                  </div>

                  <CardList bordered={false} compact style={{ maxHeight: '225px' }}>
                    {fileUploadAtomicStore.data.map(e => (
                      <Card interactive={false} className="flex justify-between" key={e.id}>
                        <p>{e.file.name}</p>

                        {finishedUploadedFiles.find(item => item.id === e.id) ? (
                          <Icon
                            icon={
                              finishedUploadedFiles.find(item => item.id === e.id)?.isSuccess
                                ? 'tick'
                                : 'issue'
                            }
                            className="ml-5"
                          />
                        ) : (
                          <Spinner size={20} intent={Intent.PRIMARY} className="ml-5" />
                        )}
                      </Card>
                    ))}
                  </CardList>
                </div>
              ),
              ...progressToastProps,
            },
            key
          );

          queue.length = 0;
        }
      }

      // wait for 1 second before changing text
      await sleep(1000);

      // update toast add close button after upload is done
      fileContentProgressToast.show(
        {
          message: (
            <div>
              <div className="flex justify-between items-center my-2 px-3">
                <p className="font-bold">
                  Uploaded {finishedUploadedFiles.filter(e => e.isSuccess).length} of {totalLength}{' '}
                  files
                </p>

                <Button
                  icon="cross"
                  minimal
                  onClick={() => fileContentProgressToast.dismiss(key)}
                />
              </div>

              <CardList bordered={false} compact style={{ maxHeight: '225px' }}>
                {fileUploadAtomicStore.data.map(e => (
                  <Card interactive={false} className="flex justify-between" key={e.id}>
                    <p>{e.file.name}</p>

                    <Icon
                      icon={
                        finishedUploadedFiles.find(item => item.id === e.id)?.isSuccess
                          ? 'tick'
                          : 'issue'
                      }
                      className="ml-5"
                    />
                  </Card>
                ))}
              </CardList>
            </div>
          ),
          ...progressToastProps,
        },
        key
      );

      // reset value so that same file triggers upload
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }, [
      fileStructureApiService,
      fileUploadAtomicStore.data,
      fileUploadAtomicStore.duplicates,
      fileUploadAtomicStore.keepBoth,
      inputRef,
    ]);

    const onFileUploadChange = useCallback(
      async (e: ChangeEvent<HTMLInputElement>) => {
        const { parentId } = getFileStructureUrlParams();

        // dissmiss previous toasts
        fileContentProgressToast.clear();

        // reset state
        fileUploadAtomicStore.resetState();

        if (!validateFileSize(e.currentTarget.files)) {
          return;
        }

        const data = Array.from(e.currentTarget.files).map(file => ({ id: uuid(), file }));

        fileUploadAtomicStore.setFiles(data);

        const { data: duplicateData, error } = await fileStructureApiService.detectDuplicate({
          titles: data.map(e => e.file.name),
          isFile: true,
          parentId,
        });

        if (error) {
          throw new Error('Something unexpected happend');
        }

        const hasAnyDuplicate = duplicateData?.some(e => e.hasDuplicate);

        if (hasAnyDuplicate) {
          fileUploadAtomicStore.setDuplicates(duplicateData ?? []);
        }

        // start process (dialog or straight upload) based on hasAnyDuplicate
        hasAnyDuplicate ? setDuplicateNameDialogOpen(true) : await start();
      },
      [fileStructureApiService, fileUploadAtomicStore, start]
    );

    return (
      <>
        <DuplicateNameDialogWidget
          isOpen={isDuplicateNameDialogOpen}
          setIsOpen={setDuplicateNameDialogOpen}
          callBack={async ({ keepBoth }) => {
            fileUploadAtomicStore.setKeepBoth(keepBoth);
            await start();
          }}
        />

        <input
          type="file"
          name="file-upload"
          className="hidden"
          ref={inputRef}
          onChange={onFileUploadChange}
          multiple
        />
      </>
    );
  }
);

import {
  ToastProps,
  Intent,
  Spinner,
  OverlayToaster,
  Position,
  Card,
  CardList,
  Icon,
  Button,
} from '@blueprintjs/core';
import { v4 as uuid } from 'uuid';
import { ChangeEvent, useCallback } from 'react';
import { validateFileSize } from '../helper/validate-file';
import { sleep } from '../../../shared';

const progressToat = OverlayToaster.create({
  canEscapeKeyClear: false,
  position: Position.BOTTOM_RIGHT,
  autoFocus: false,
});

const progressToastProps: Omit<ToastProps, 'message'> = {
  className: 'only-for-file-upload',
  isCloseButtonShown: false,
  intent: Intent.NONE,
  timeout: 10000000,
};

export const FileUploadItem = ({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
}): React.JSX.Element => {
  const onFileUploadChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    console.log('='.repeat(20));
    console.log(files);

    if (!validateFileSize(files)) {
      return;
    }

    const data = Array.from(files).map(file => ({ id: uuid(), file }));
    const totalLength = files.length;

    const key = progressToat.show({
      message: (
        <div>
          <div className="flex justify-between items-center my-2 px-3">
            <p className="font-bold">Uploading {totalLength} files</p>

            <Button icon="cross" minimal className="invisible pointer-events-none" />
          </div>

          <CardList bordered={false} compact={true} style={{ maxHeight: '225px' }}>
            {data.map(e => (
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

    //TODO handle upload by calling multiple parallel api calls and on each one update toast
    await new Promise(f => setTimeout(f, 1000));

    const maxCount = 2;
    const reminder = totalLength % maxCount;
    const queue: { file: File; id: string }[] = [];
    const finishedUploadedFiles: { isSuccess: boolean; file: File; id: string }[] = [];

    let totalUploadCount = 0;

    // start batch upload
    for (const obj of data) {
      queue.push(obj);

      if (
        queue.length === maxCount ||
        (reminder !== 0 && totalUploadCount === totalLength - reminder)
      ) {
        //TODO upload backend
        //TODO plus calculate each file in this batch and if total exceeds for example more than 30 mb
        //TODO then split into multiple backend api call so that bandwidth would not be for example 150mb

        for (const queueItem of queue) {
          await new Promise(f => setTimeout(f, 1000));

          finishedUploadedFiles.push({
            id: queueItem.id,
            file: queueItem.file,
            isSuccess: Math.random() > 0.5, // change later based on real upload
          });
        }

        totalUploadCount += queue.length === maxCount ? maxCount : reminder; // this is for internal use only (unlike in folders upload)

        progressToat.show(
          {
            message: (
              <div>
                <div className="flex justify-between items-center my-2 px-3">
                  <p className="font-bold">Uploading {totalLength} files</p>

                  <Button icon="cross" minimal className="invisible pointer-events-none" />
                </div>

                <CardList bordered={false} compact={true} style={{ maxHeight: '225px' }}>
                  {data.map(e => (
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
    progressToat.show(
      {
        message: (
          <div>
            <div className="flex justify-between items-center my-2 px-3">
              <p className="font-bold">
                Uploaded {finishedUploadedFiles.filter(e => e.isSuccess).length} of {totalLength}{' '}
                files
              </p>

              <Button icon="cross" minimal onClick={() => progressToat.dismiss(key)} />
            </div>

            <CardList bordered={false} compact={true} style={{ maxHeight: '225px' }}>
              {data.map(e => (
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
    e.target.value = '';

    // wait 5 second before closing toaster by force if user does not closes
    await sleep(5000);
    progressToat.dismiss(key);
  }, []);

  return (
    <>
      <input
        type="file"
        name="file-upload"
        className="hidden"
        ref={inputRef}
        onChange={onFileUploadChange}
        multiple={true}
      />
    </>
  );
};

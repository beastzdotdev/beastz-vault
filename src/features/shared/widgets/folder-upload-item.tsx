import { ToastProps, Intent, OverlayToaster, Position } from '@blueprintjs/core';
import { ChangeEvent, useCallback } from 'react';
import { sleep } from '../../../shared';
import { validateFileSize } from '../helper/validate-file';
import {
  buildWBKTree,
  WBKTreeNode,
  wbkBreadthFirstSearch,
} from '../../../shared/advanced-helpers/tree-data';

const progressToat = OverlayToaster.create({
  canEscapeKeyClear: false,
  position: Position.BOTTOM_RIGHT,
  autoFocus: false,
});

const progressToastProps: Omit<ToastProps, 'message'> = {
  isCloseButtonShown: false,
  icon: 'cloud-upload',
  intent: Intent.NONE,
  timeout: 10000000,
};

export const FolderUploadItem = ({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
}): React.JSX.Element => {
  const onFolderUploadChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (!validateFileSize(files)) {
      return;
    }

    const { data, totalLength } = buildWBKTree(files);

    const key = progressToat.show({
      message: `${data[0].name}: 0 of ${totalLength}`,
      ...progressToastProps,
    });

    const maxCount = 2;
    const reminder = totalLength % maxCount;
    const queue: WBKTreeNode[] = [];

    let totalUploadCount = 0;

    // start batch upload (by bfs type upload)
    await wbkBreadthFirstSearch(data, async item => {
      queue.push(item);

      if (
        queue.length === maxCount ||
        (reminder !== 0 && totalUploadCount === totalLength - reminder)
      ) {
        //TODO upload backend
        //TODO plus calculate each file in this batch and if total exceeds for example more than 30 mb
        //TODO then split into multiple backend api call so that bandwidth would not be for example 150mb

        await new Promise(f => setTimeout(f, 1000));

        totalUploadCount += queue.length === maxCount ? maxCount : reminder;

        progressToat.show(
          {
            message: `${data[0].name}: ${totalUploadCount} of ${totalLength}`,
            ...progressToastProps,
          },
          key
        );

        queue.length = 0;
      }
    });

    // wait for 1 second before changing text
    await sleep(1000);

    // update toast add close button after upload is done
    progressToat.show(
      {
        message: `completed ${totalUploadCount} of ${totalLength}`,
        ...progressToastProps,
        isCloseButtonShown: true, // <- show close button
      },
      key
    );

    // reset input target value so that same file triggers onChange event
    e.target.value = '';

    // wait 5 second before closing toaster by force if user does not closes
    await sleep(5000);
    progressToat.clear();
  }, []);

  return (
    <>
      <input
        type="file"
        name="folder-upload"
        className="hidden"
        ref={inputRef}
        multiple={false}
        onChange={onFolderUploadChange}
        //
        //
        //! For folder upload
        // @ts-expect-error: something
        webkitdirectory=""
        mozdirectory=""
        directory=""
      />
    </>
  );
};
import { ToastProps, Intent } from '@blueprintjs/core';
import { ChangeEvent, useCallback } from 'react';
import { validateFileSize } from '../helper/validate-file';
import { buildWBKTree, WBKTreeNode } from '../../../shared/advanced-helpers/tree-data';
import { useInjection } from 'inversify-react';
import {
  BasicFileStructureResponseDto,
  FileStructureApiService,
  fileContentProgressToast,
  sleep,
} from '../../../shared';
import { getFileStructureUrlParams } from '../helper/get-url-params';

const progressToastProps: Omit<ToastProps, 'message'> = {
  isCloseButtonShown: false,
  icon: 'folder-close',
  intent: Intent.NONE,
  timeout: 10000000,
};

const maxCount = 3;

export const FolderUploadItem = ({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
}): React.JSX.Element => {
  const fileStructureApiService = useInjection(FileStructureApiService);

  const onFolderUploadChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      // dissmiss previous toasts
      fileContentProgressToast.clear();

      const files = e.currentTarget.files;

      if (!validateFileSize(files)) {
        return;
      }

      const { parentId, rootParentId } = getFileStructureUrlParams();
      const { data: tree, totalLength } = buildWBKTree(files);

      const key = fileContentProgressToast.show({
        message: `${tree[0].name}: 0 of ${totalLength}`,
        ...progressToastProps,
      });

      const reminder = totalLength % maxCount;
      const queue: WBKTreeNode[] = [];
      const completedUploaded: (BasicFileStructureResponseDto & {
        generatedId: string;
        generatedParentId: string | null;
      })[] = []; // this is flat list for uploaded items

      let totalUploadCount = 0;

      const queueForBFS: WBKTreeNode[] = [];
      const visited: Set<string> = new Set();

      // Add the top-level nodes to the queue
      for (const node of tree) {
        queueForBFS.push(node);
      }

      while (queueForBFS.length > 0) {
        // Remove and process the first node in the queueForBFS
        const currentNode = queueForBFS.shift()!;

        if (!visited.has(currentNode.path)) {
          // If the current node has children, add them to the queueForBFS
          for (const child of currentNode.children || []) {
            queueForBFS.push(child);
          }

          // Mark the current node as visited
          visited.add(currentNode.path);

          queue.push(currentNode);

          //! Upload logic starts here
          const foundParent = completedUploaded.find(
            e => e.generatedId === currentNode.generatedParentId
          );
          let completed: BasicFileStructureResponseDto | undefined = undefined;

          // Upload to backend must happen before sleep
          if (currentNode.children?.length) {
            const { data, error } = await fileStructureApiService.createFolder({
              name: currentNode.name,
              rootParentId: rootParentId ?? foundParent?.id,
              parentId: currentNode.generatedParentId === null ? parentId : foundParent?.id,

              //TODO message left
              //TODO fix keep both param sending both in folder upload and folder creation
              keepBoth: false, //TODO fix this
            });

            // FOr debug purposes only
            // await new Promise(f => setTimeout(f, 5000));

            if (error) {
              console.log('='.repeat(20));
              console.log(currentNode);
              console.log(error);
            }

            if (data) {
              completed = data;
            }
          } else {
            const { data, error } = await fileStructureApiService.uploadFile({
              file: currentNode.file!,
              rootParentId: rootParentId ?? foundParent?.id,
              parentId: foundParent?.id,
              // in folder upload file will always be inside or rather created first time
              // so this params can always be false
              keepBoth: false,
            });

            if (error) {
              console.log('='.repeat(20));
              console.log(currentNode);
              console.log(error);
            }

            if (data) {
              completed = data;
            }
          }

          if (completed) {
            completedUploaded.push({
              ...completed,
              generatedId: currentNode.generatedId,
              generatedParentId: currentNode.generatedParentId,
            });
          }

          // This is needed in order for server to breathe a little
          if (
            queue.length === maxCount ||
            (reminder !== 0 && totalUploadCount === totalLength - reminder)
          ) {
            await new Promise(f => setTimeout(f, 1000));

            totalUploadCount += queue.length === maxCount ? maxCount : reminder;

            fileContentProgressToast.show(
              {
                message: `${tree[0].name}: ${totalUploadCount} of ${totalLength}`,
                ...progressToastProps,
              },
              key
            );

            queue.length = 0;
          }
        }
      }

      // wait for 1 second before changing text
      await sleep(1000);

      // update toast add close button after upload is done
      fileContentProgressToast.show(
        {
          message: `completed ${totalUploadCount} of ${totalLength}`,
          ...progressToastProps,
          isCloseButtonShown: true, // <- show close button
        },
        key
      );

      // reset input target value so that same file triggers onChange event
      e.target.value = '';

      //! Uncomment bellow code if you want auto closing
      // wait 5 second before closing toaster by force if user does not closes
      // await sleep(5000);
      // fileContentProgressToast.clear();
    },
    [fileStructureApiService]
  );

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

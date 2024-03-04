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

const progressToastProps: Omit<ToastProps, 'message'> = {
  isCloseButtonShown: false,
  icon: 'folder-close',
  intent: Intent.NONE,
  timeout: 10000000,
};

export const FolderUploadItem = ({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
}): React.JSX.Element => {
  const fileStructureApiService = useInjection(FileStructureApiService);

  const onFolderUploadChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const urlObj = new URL(window.location.href);
      const tempRootParentId = urlObj.searchParams.get('root_parent_id');
      const tempParentId = urlObj.searchParams.get('id');

      const rootParentId = tempRootParentId ? parseInt(tempRootParentId) : undefined;
      const parentId = tempParentId ? parseInt(tempParentId) : undefined;

      // dissmiss previous toasts
      fileContentProgressToast.clear();

      const files = e.currentTarget.files;

      if (!validateFileSize(files)) {
        return;
      }

      const { data: tree, totalLength } = buildWBKTree(files);

      const key = fileContentProgressToast.show({
        message: `${tree[0].name}: 0 of ${totalLength}`,
        ...progressToastProps,
      });

      const maxCount = 3;
      const reminder = totalLength % maxCount;
      const queue: WBKTreeNode[] = [];
      const completedUploaded: (BasicFileStructureResponseDto & {
        generatedId: string;
        generatedParentId: string | null;
      })[] = []; // this is flat list for uploaded items

      let totalUploadCount = 0;

      // start batch upload (by bfs type upload)
      // await wbkBreadthFirstSearch(data, async item => {
      //   queue.push(item);

      //   const foundParent = completedUploaded.find(e => e.generatedId === item.generatedParentId);
      //   let completed: BasicFileStructureResponseDto | undefined = undefined;

      //   // Upload to backend must happen before sleep
      //   if (item.children?.length) {
      //     const { data, error } = await fileStructureApiService.createFolder({
      //       name: item.name,
      //       rootParentId,
      //       parentId: item.generatedParentId === null ? parentId : foundParent?.id,
      //     });

      //     if (error) {
      //       console.log('='.repeat(20));
      //       console.log(item);
      //       console.log(error);
      //     }

      //     if (data) {
      //       completed = data;
      //     }
      //   } else {
      //     const { data, error } = await fileStructureApiService.uploadFile({
      //       file: item.file!,
      //       rootParentId: rootParentId ?? foundParent?.id,
      //       parentId: foundParent?.id,
      //     });

      //     if (error) {
      //       console.log('='.repeat(20));
      //       console.log(item);
      //       console.log(error);
      //     }

      //     if (data) {
      //       completed = data;
      //     }
      //   }

      //   if (completed) {
      //     completedUploaded.push({
      //       ...completed,
      //       generatedId: item.generatedId,
      //       generatedParentId: item.generatedParentId,
      //     });
      //   }

      //   // This is needed in order for server to breathe a little
      //   if (
      //     queue.length === maxCount ||
      //     (reminder !== 0 && totalUploadCount === totalLength - reminder)
      //   ) {
      //     await new Promise(f => setTimeout(f, 1000));

      //     totalUploadCount += queue.length === maxCount ? maxCount : reminder;

      //     fileContentProgressToast.show(
      //       {
      //         message: `${data[0].name}: ${totalUploadCount} of ${totalLength}`,
      //         ...progressToastProps,
      //       },
      //       key
      //     );

      //     queue.length = 0;
      //   }
      // });

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
          // Perform the desired operation on the current node (in this case, printing the path)
          // console.log(currentNode.name + ': ' + currentNode.path);

          // If the current node has children, add them to the queueForBFS
          for (const child of currentNode.children || []) {
            queueForBFS.push(child);
          }

          // Mark the current node as visited
          visited.add(currentNode.path);

          //! start batch upload
          queue.push(currentNode);

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
            });

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

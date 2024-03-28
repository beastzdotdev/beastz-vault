import { v4 as uuid } from 'uuid';
/**
 * @description WBK for making obvious that it was created from browser webkitRelativePath
 *              and not from the backend file entities
 *
 */

export enum WBKFileType {
  FILE = 'file',
  FOLDER = 'folder',
}

export type WBKTreeNode = {
  generatedId: string;
  generatedParentId: string | null;
  name: string;
  path: string;
  type: WBKFileType;
  file?: File;
  children?: WBKTreeNode[];
};

/**
 * totalLength property also includes folder count in length as well
 */
export const buildWBKTree = (files: File[]): { data: WBKTreeNode[]; totalLength: number } => {
  const tree: WBKTreeNode[] = [];
  let totalLength = 0;

  for (const file of files) {
    const pathParts = file.webkitRelativePath.split('/');
    let currentNode = tree.find(node => node.name === pathParts[0]); // creates root folder

    if (!currentNode) {
      currentNode = {
        generatedId: uuid(),
        generatedParentId: null,
        name: pathParts[0],
        path: '/' + pathParts[0],
        type: WBKFileType.FOLDER,
        children: [],
      };

      tree.push(currentNode);
      totalLength++;
    }

    for (let i = 1; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLastPart = i === pathParts.length - 1;

      let existingNode: WBKTreeNode | undefined = currentNode.children?.find(
        node => node.name === part
      );

      if (!existingNode) {
        const type = isLastPart ? WBKFileType.FILE : WBKFileType.FOLDER;

        existingNode = {
          generatedId: uuid(),
          generatedParentId: currentNode?.generatedId ?? null,
          name: part,
          path: currentNode.path + '/' + part,
          type,
          ...(type === WBKFileType.FILE && { file }),
          ...(type === WBKFileType.FOLDER && { children: [] }),
        };

        currentNode.children?.push(existingNode);
        totalLength++;
      }

      currentNode = existingNode;
    }
  }

  return {
    data: tree,
    totalLength,
  };
};

/**
 * @description For now this method is not used anywhere but it can be used in the future
 */
export const wbkBreadthFirstSearch = async (
  treeNodes: WBKTreeNode[],
  callback?: (currentNode: WBKTreeNode) => Promise<void>
): Promise<void> => {
  const queue: WBKTreeNode[] = [];
  const visited: Set<string> = new Set();

  // Add the top-level nodes to the queue
  for (const node of treeNodes) {
    queue.push(node);
  }

  while (queue.length > 0) {
    // Remove and process the first node in the queue
    const currentNode = queue.shift()!;

    if (!visited.has(currentNode.path)) {
      // Perform the desired operation on the current node (in this case, printing the path)
      // console.log(currentNode.name + ': ' + currentNode.path);

      // If the current node has children, add them to the queue
      for (const child of currentNode.children || []) {
        queue.push(child);
      }

      // Mark the current node as visited
      visited.add(currentNode.path);

      if (callback) {
        await callback(currentNode);
      }
    }
  }
};

enum FileType {
  FILE = 'file',
  FOLDER = 'folder',
}

type TreeNode = {
  name: string;
  path: string;
  type: FileType;
  children?: TreeNode[];
};

// Example files array
const files = [
  { webkitRelativePath: 'Folder1/Subfolder1/subf3/File2.txt' },
  { webkitRelativePath: 'Folder1/File1.txt' },
  { webkitRelativePath: 'Folder1/Subfolder1/File22.txt' },
  { webkitRelativePath: 'Folder1/Subfolder2/File3.txt' },
  { webkitRelativePath: 'Folder1/File4.txt' },
  { webkitRelativePath: 'File4.txt' },
];

function buildTree(files: { webkitRelativePath: string }[]): TreeNode[] {
  const tree: TreeNode[] = [];

  for (const file of files) {
    const pathParts = file.webkitRelativePath.split('/');
    let currentNode = tree.find(node => node.name === pathParts[0]) as TreeNode;

    if (!currentNode) {
      currentNode = {
        name: pathParts[0],
        path: '/' + pathParts[0],
        type: FileType.FOLDER,
        children: [],
      };

      tree.push(currentNode);
    }

    for (let i = 1; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLastPart = i === pathParts.length - 1;
      let existingNode = currentNode.children?.find(node => node.name === part);

      if (!existingNode) {
        const type = isLastPart ? FileType.FILE : FileType.FOLDER;
        existingNode = { name: part, path: currentNode.path + '/' + part, type, children: [] };
        currentNode.children!.push(existingNode);
      }

      currentNode = existingNode;
    }
  }

  return tree;
}

function breadthFirstSearch(treeNodes: TreeNode[]): void {
  const queue: TreeNode[] = [];
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
      console.log(currentNode.name + ': ' + currentNode.path);

      // If the current node has children, add them to the queue
      for (const child of currentNode.children || []) {
        queue.push(child);
      }

      // Mark the current node as visited
      visited.add(currentNode.path);
    }
  }
}

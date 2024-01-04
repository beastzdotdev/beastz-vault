import { TreeNodeInfo, Icon, Intent, Classes, Tree, ContextMenu, Tooltip } from '@blueprintjs/core';
import { useCallback, useReducer } from 'react';

type ReactClick = React.MouseEvent<HTMLElement>;
type NodePath = number[];
type TreeAction =
  | { type: 'SET_IS_EXPANDED'; payload: { path: NodePath; isExpanded: boolean } }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_IS_SELECTED'; payload: { path: NodePath; isSelected: boolean } };

const forEachNode = (nodes: TreeNodeInfo[] | undefined, callback: (node: TreeNodeInfo) => void) => {
  if (nodes === undefined) {
    return;
  }

  for (const node of nodes) {
    callback(node);
    forEachNode(node.childNodes, callback);
  }
};

const forNodeAtPath = (nodes: TreeNodeInfo[], path: NodePath, cb: (node: TreeNodeInfo) => void) => {
  cb(Tree.nodeFromPath(path, nodes));
};

function treeExampleReducer(state: TreeNodeInfo[], action: TreeAction) {
  const newState = state.slice();

  switch (action.type) {
    case 'DESELECT_ALL':
      forEachNode(newState, node => (node.isSelected = false));
      break;
    case 'SET_IS_EXPANDED':
      forNodeAtPath(
        newState,
        action.payload.path,
        node => (node.isExpanded = action.payload.isExpanded)
      );
      break;
    case 'SET_IS_SELECTED':
      forNodeAtPath(
        newState,
        action.payload.path,
        node => (node.isSelected = action.payload.isSelected)
      );
  }

  return newState;
}

const INITIAL_STATE: TreeNodeInfo[] = [
  {
    id: 0,
    hasCaret: true,
    icon: 'folder-close',
    label: <ContextMenu content={<div>Hello there!</div>}>Folder 0</ContextMenu>,
  },
  {
    id: 1,
    icon: 'folder-close',
    isExpanded: true,
    label: (
      <ContextMenu content={<div>Hello there!</div>}>
        <Tooltip content="I'm a folder <3" placement="right">
          Folder 1
        </Tooltip>
      </ContextMenu>
    ),
    childNodes: [
      {
        id: 2,
        icon: 'document',
        label: 'Item 0',
        secondaryLabel: (
          <Tooltip content="An eye!">
            <Icon icon="eye-open" />
          </Tooltip>
        ),
      },
      {
        id: 3,
        icon: <Icon icon="tag" intent={Intent.PRIMARY} className={Classes.TREE_NODE_ICON} />,
        label: 'Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.',
      },
      {
        id: 4,
        hasCaret: true,
        icon: 'folder-close',
        label: (
          <ContextMenu content={<div>Hello there!</div>}>
            <Tooltip content="foo" placement="right">
              Folder 2
            </Tooltip>
          </ContextMenu>
        ),
        childNodes: [
          { id: 5, label: 'No-Icon Item' },
          { id: 6, icon: 'tag', label: 'Item 1' },
          {
            id: 7,
            hasCaret: true,
            icon: 'folder-close',
            label: <ContextMenu content={<div>Hello there!</div>}>Folder 3</ContextMenu>,
            childNodes: [
              { id: 8, icon: 'document', label: 'Item 0' },
              { id: 9, icon: 'tag', label: 'Item 1' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    hasCaret: true,
    icon: 'folder-close',
    label: 'Super secret files',
    disabled: true,
  },
];

export const TreeNodesTestPage = () => {
  const [nodes, dispatch] = useReducer(treeExampleReducer, INITIAL_STATE);

  const handleNodeClick = useCallback((node: TreeNodeInfo, nodePath: NodePath, _e: ReactClick) => {
    const toggleExpanded = !node.isExpanded;

    dispatch({
      type: 'DESELECT_ALL',
    });
    dispatch({
      payload: { path: nodePath, isExpanded: toggleExpanded },
      type: 'SET_IS_EXPANDED',
    });
    dispatch({
      payload: { path: nodePath, isSelected: true },
      type: 'SET_IS_SELECTED',
    });
  }, []);

  const handleNodeCollapse = useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
    dispatch({
      payload: { path: nodePath, isExpanded: false },
      type: 'SET_IS_EXPANDED',
    });
  }, []);

  const handleNodeExpand = useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
    dispatch({
      payload: { path: nodePath, isExpanded: true },
      type: 'SET_IS_EXPANDED',
    });
  }, []);

  return (
    <>
      <Tree
        contents={nodes}
        onNodeClick={handleNodeClick}
        onNodeCollapse={handleNodeCollapse}
        onNodeExpand={handleNodeExpand}
      />
    </>
  );
};

import { TreeNodeInfo, Tree, ContextMenu } from '@blueprintjs/core';
import { useCallback, useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type NodeCustomData = { link: string | null };
type SidebarNodeInfo = TreeNodeInfo<NodeCustomData>;

type ReactClick = React.MouseEvent<HTMLElement>;
type NodePath = number[];
type TreeAction =
  | { type: 'SET_IS_EXPANDED'; payload: { path: NodePath; isExpanded: boolean } }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_IS_SELECTED'; payload: { path: NodePath; isSelected: boolean } }
  | { type: 'SELECT_ON_ROUTE_CHANGE'; payload: { path: string } };

const forEachNode = (
  nodes: SidebarNodeInfo[] | undefined,
  callback: (node: SidebarNodeInfo) => void
) => {
  if (nodes === undefined) {
    return;
  }

  for (const node of nodes) {
    callback(node);
    forEachNode(node.childNodes, callback);
  }
};

const forEachNodeFindByUrl = (nodes: SidebarNodeInfo[] | undefined, path: string) => {
  if (nodes === undefined) {
    return;
  }

  for (const node of nodes) {
    if (node.nodeData?.link?.startsWith(path)) {
      node.isSelected = true;
      return;
    }

    forEachNodeFindByUrl(node.childNodes, path);
  }
};

function treeExampleReducer(state: SidebarNodeInfo[], action: TreeAction) {
  const newState = state.slice();

  switch (action.type) {
    case 'DESELECT_ALL':
      forEachNode(newState, node => (node.isSelected = false));
      break;
    case 'SET_IS_EXPANDED':
      Tree.nodeFromPath(action.payload.path, newState).isExpanded = action.payload.isExpanded;
      break;
    case 'SET_IS_SELECTED':
      Tree.nodeFromPath(action.payload.path, newState).isSelected = action.payload.isSelected;
      break;
    case 'SELECT_ON_ROUTE_CHANGE':
      forEachNodeFindByUrl(newState, action.payload.path);
      break;
  }

  return newState;
}

const INITIAL_STATE: SidebarNodeInfo[] = [
  {
    id: 0,
    icon: 'book',
    label: 'Books',
  },
  {
    id: 1,
    icon: 'lab-test',
    label: <ContextMenu content={<div>Hello there!</div>}>Test</ContextMenu>,
  },
  // {
  //   id: 1,
  //   icon: 'folder-close',
  //   isExpanded: true,
  //   label: (
  //     <ContextMenu2 content={<div>Hello there!</div>}>
  //       <Tooltip2 content="I'm a folder <3" placement="right">
  //         Folder 1
  //       </Tooltip2>
  //     </ContextMenu2>
  //   ),
  //   childNodes: [
  //     {
  //       id: 2,
  //       icon: 'document',
  //       label: 'Item 0',
  //       secondaryLabel: (
  //         <Tooltip2 content="An eye!">
  //           <Icon icon="eye-open" />
  //         </Tooltip2>
  //       ),
  //     },
  //     {
  //       id: 3,
  //       icon: <Icon icon="tag" intent={Intent.PRIMARY} className={Classes.TREE_NODE_ICON} />,
  //       label: 'Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.',
  //     },
  //     {
  //       id: 300,
  //       label: 'Something',
  //       nodeData: {
  //         link: '/profile',
  //       },
  //     },
  //     {
  //       id: 4,
  //       hasCaret: true,
  //       icon: 'folder-close',
  //       label: (
  //         <ContextMenu2 content={<div>Hello there!</div>}>
  //           <Tooltip2 content="foo" placement="right">
  //             Folder 2
  //           </Tooltip2>
  //         </ContextMenu2>
  //       ),
  //     },
  //   ],
  // },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nodes, dispatch] = useReducer(treeExampleReducer, INITIAL_STATE);

  // listen to route changes
  useEffect(() => {
    dispatch({
      type: 'DESELECT_ALL',
    });

    if (location.pathname === '/') {
      return;
    }

    dispatch({
      type: 'SELECT_ON_ROUTE_CHANGE',
      payload: { path: location.pathname },
    });
  }, [location]);

  const handleNodeClick = useCallback(
    (node: SidebarNodeInfo, nodePath: NodePath, _e: ReactClick) => {
      const nodeData = node.nodeData;
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

      if (nodeData && nodeData.link && location.pathname != nodeData.link) {
        navigate(nodeData.link);
      }
    },
    [location.pathname, navigate]
  );

  const handleNodeCollapse = useCallback((_node: SidebarNodeInfo, nodePath: NodePath) => {
    dispatch({
      payload: { path: nodePath, isExpanded: false },
      type: 'SET_IS_EXPANDED',
    });
  }, []);

  const handleNodeExpand = useCallback((_node: SidebarNodeInfo, nodePath: NodePath) => {
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

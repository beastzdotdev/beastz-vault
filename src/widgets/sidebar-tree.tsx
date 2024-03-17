import { TreeNodeInfo, Tree } from '@blueprintjs/core';
import { useCallback, useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type SidebarNodeInfo = TreeNodeInfo<{ link?: string; isFile: boolean; path: string }>;

type ReactClick = React.MouseEvent<HTMLElement>;
type NodePath = number[];
type TreeAction =
  | { type: 'SET_IS_EXPANDED'; payload: { path: NodePath; isExpanded: boolean } }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_IS_SELECTED'; payload: { path: NodePath; isSelected: boolean } }
  | { type: 'SELECT_ON_ROUTE_CHANGE'; payload: { path: string } }
  | { type: 'UPDATE_STATE'; payload: { data: SidebarNodeInfo[] } };

type SelectOnRouteChangeAction = Extract<TreeAction, { type: 'SELECT_ON_ROUTE_CHANGE' }>;

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

const forEachNodeFindByUrl = (
  nodes: SidebarNodeInfo[] | undefined,
  path: string
): SidebarNodeInfo | undefined => {
  if (nodes === undefined) {
    return;
  }

  for (const node of nodes) {
    if (node.nodeData?.link === path) {
      node.isSelected = true;
      return node;
    }

    const foundNode = forEachNodeFindByUrl(node.childNodes, path);
    if (foundNode) {
      return foundNode;
    }
  }

  return;
};

const forEachNodeExpand = (nodes: SidebarNodeInfo[] | undefined, path: string) => {
  if (nodes === undefined) {
    return;
  }

  for (const node of nodes) {
    if (path.startsWith(node.nodeData!.path)) {
      node.isExpanded = true;
      return;
    }

    forEachNodeExpand(node.childNodes, path);
  }
};

function treeExampleReducer(state: SidebarNodeInfo[], action: TreeAction) {
  const newState = state.slice();

  switch (action.type) {
    case 'DESELECT_ALL':
      forEachNode(newState, node => {
        node.isSelected = false;
      });
      break;
    case 'SET_IS_EXPANDED':
      Tree.nodeFromPath(action.payload.path, newState).isExpanded = action.payload.isExpanded;
      break;
    case 'SET_IS_SELECTED':
      Tree.nodeFromPath(action.payload.path, newState).isSelected = action.payload.isSelected;
      break;
    case 'SELECT_ON_ROUTE_CHANGE':
      // forEachNodeFindByUrl(newState, action.payload.path);
      selectAndExpandOnRouteChange(newState, action);
      break;
    case 'UPDATE_STATE':
      return action.payload.data;
  }

  return newState;
}

function selectAndExpandOnRouteChange(
  newState: SidebarNodeInfo[],
  action: SelectOnRouteChangeAction
) {
  const x = forEachNodeFindByUrl(newState, action.payload.path);
  console.log('='.repeat(20));
  console.log(x);
  if (x && x.parentId !== null) {
    forEachNodeExpand(newState, x.nodeData!.path);
  }
}

export const SidebarTree = (params: { state: SidebarNodeInfo[] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nodes, dispatch] = useReducer(treeExampleReducer, params.state);

  const revalidateTreeSelectionStatus = useCallback(() => {
    dispatch({
      type: 'DESELECT_ALL',
    });

    if (location.pathname === '/') {
      return;
    }

    const z = location.search ? location.pathname + location.search : location.pathname;

    dispatch({
      type: 'SELECT_ON_ROUTE_CHANGE',
      payload: { path: z },
    });
  }, [location]);

  // listen to route changes
  useEffect(() => {
    revalidateTreeSelectionStatus();
  }, [revalidateTreeSelectionStatus]);

  // listen to state change from parent
  useEffect(() => {
    dispatch({
      type: 'UPDATE_STATE',
      payload: {
        data: params.state,
      },
    });

    // revalidateTreeSelectionStatus();
  }, [params.state, revalidateTreeSelectionStatus]);

  const handleNodeClick = useCallback(
    (node: SidebarNodeInfo, nodePath: NodePath, _e: ReactClick) => {
      const nodeData = node.nodeData;

      dispatch({
        type: 'DESELECT_ALL',
      });
      dispatch({
        payload: { path: nodePath, isSelected: true },
        type: 'SET_IS_SELECTED',
      });

      if (nodeData?.isFile) {
        //TODO check if is file and if file show popup just like in root page on double click
        return;
      }

      if (nodeData && nodeData.link) {
        const existingLocation = window.location;

        const nodeDataUrlObj = new URL(existingLocation.origin + nodeData.link);
        const existingUrlObj = new URL(existingLocation.href);

        // check node data click happens on same page
        if (
          nodeDataUrlObj.searchParams.get('id') === existingUrlObj.searchParams.get('id') &&
          nodeDataUrlObj.searchParams.get('root_parent_id') ===
            existingUrlObj.searchParams.get('root_parent_id')
        ) {
          return;
        }

        navigate(nodeData.link);
      }
    },
    [navigate]
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
        className="gorilla-sidebar-tree-nodes p-1.5"
        contents={nodes}
        onNodeClick={handleNodeClick}
        onNodeCollapse={handleNodeCollapse}
        onNodeExpand={handleNodeExpand}
      />
    </>
  );
};

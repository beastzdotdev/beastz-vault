import {
  TreeNodeInfo,
  Tree,
  ContextMenu,
  Tooltip,
  Button,
  ButtonGroup,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
} from '@blueprintjs/core';
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
    icon: 'folder-close',
    label: 'Folder -1',
    childNodes: [],
  },
  {
    id: 1,
    icon: 'folder-close',
    label: 'Folder 0',
    childNodes: [],
  },
  {
    id: 2,
    icon: 'folder-close',
    isExpanded: false,
    label: 'Folder 1',
    nodeData: {
      link: '/profile',
      // link: '/files/123',
    },
    childNodes: [
      {
        id: 1,
        icon: 'document',
        label: 'Something.txt',
      },
      {
        id: 2,
        icon: 'document',
        label: 'Profile-backup.jpg',
      },
      {
        id: 3,
        label: 'Something',
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
      },
    ],
  },
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

      //TODO check if is file and if file redirect

      dispatch({
        type: 'DESELECT_ALL',
      });

      // const toggleExpanded = !node.isExpanded;
      // dispatch({
      //   payload: { path: nodePath, isExpanded: toggleExpanded },
      //   type: 'SET_IS_EXPANDED',
      // });
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
      <div>
        <ButtonGroup fill minimal vertical alignText="left" className="gorilla-sidebar-buttons">
          <Popover
            content={
              <Menu>
                <MenuItem text="New" icon="document" />
                <MenuItem text="Create" icon="folder-new" />
                <MenuDivider />
                <MenuItem text="Upload File" icon="document-open" />
                <MenuItem text="Upload Folder" icon="folder-shared-open" />
                <MenuDivider />
                <MenuItem text="Gorilla doc (coming soon)" icon="document" />
              </Menu>
            }
            placement="right-start"
          >
            <Button icon="plus" rightIcon="chevron-right" text="New" />
          </Popover>
          <Button icon="eye-open">Activity</Button>
          <Button icon="people">Members</Button>
          <Button icon="cog">Settings</Button>
        </ButtonGroup>
      </div>

      <br />
      <br />
      <br />
      <p className="text-xs text-zinc-500 font-bold pl-[7px] pb-1">Bookmarks</p>

      <Tree
        className="gorilla-sidebar-tree-nodes"
        contents={nodes}
        onNodeClick={handleNodeClick}
        onNodeCollapse={handleNodeCollapse}
        onNodeExpand={handleNodeExpand}
      />
    </>
  );
};

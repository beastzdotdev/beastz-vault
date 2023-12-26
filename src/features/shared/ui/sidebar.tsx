import {
  TreeNodeInfo,
  ContextMenu,
  Tooltip,
  Button,
  ButtonGroup,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Icon,
  Callout,
  ProgressBar,
} from '@blueprintjs/core';
import { useState } from 'react';
import logo from '../../../assets/images/profile/doodle-man-1.svg';
import { SidebarTree } from '../../../widgets/sidebar-tree';

type SidebarNodeInfo = TreeNodeInfo<{ link: string | null }>;

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

const INITIAL_STATE2: SidebarNodeInfo[] = [
  {
    id: 0,
    icon: 'folder-close',
    label: 'Some stuff',
    childNodes: [],
    isExpanded: false,
  },
  {
    id: 1,
    icon: 'folder-close',
    label: 'Misc',
    childNodes: [],
    isExpanded: false,
  },
  {
    id: 2,
    icon: 'folder-close',
    isExpanded: false,
    label: 'Interseting stuff',
    nodeData: {
      link: '/profile',
    },
  },
];

export const Sidebar = () => {
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showFiles, setShowFiles] = useState(true);

  return (
    <>
      <div className="gorilla-profile flex items-center justify-between py-2 mt-2 mx-1.5 mb-1 cursor-pointer">
        <div className="flex items-center">
          <img width={24} height={24} src={logo} alt="" className="rounded-sm ml-1.5" />

          <p className="ml-2 font-medium">Giorgi Kumelashvili</p>
        </div>

        <Icon icon="expand-all" className="justify-self-end mr-2.5" />
      </div>

      <div>
        <ButtonGroup
          fill
          minimal
          vertical
          alignText="left"
          className="px-1.5 pb-1.5 gorilla-sidebar-buttons"
        >
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

      <div
        className="hover:bg-zinc-800 active:bg-zinc-700 w-fit ml-3"
        onClick={() => setShowBookmarks(!showBookmarks)}
      >
        <p className="text-xs text-zinc-500 font-bold cursor-pointer">Bookmarks</p>
      </div>

      {showBookmarks && <SidebarTree state={INITIAL_STATE} />}

      <div className="my-2"></div>

      <div
        className="hover:bg-zinc-800 active:bg-zinc-700 w-fit ml-3"
        onClick={() => setShowFiles(!showFiles)}
      >
        <p className="text-xs text-zinc-500 font-bold cursor-pointer">Files</p>
      </div>

      {showFiles && <SidebarTree state={INITIAL_STATE2} />}

      <div className="my-5"></div>

      <div className="absolute bottom-0 w-full">
        <ButtonGroup
          fill
          minimal
          vertical
          alignText="left"
          className="px-1.5 pb-1.5 gorilla-sidebar-buttons"
        >
          <Button icon="inherited-group" text="Shared" />
          <Button icon="updated" text="Recent" />
          <Button icon="trash" text="Trash" />
          <Button icon="ninja" text="AI (coming soon)" />
          <Button icon="help" text="Support & Help" />
        </ButtonGroup>

        <Callout className="gorilla-callout !bg-zinc-900" title={'Storage'} icon="cloud">
          <ProgressBar
            animate={false}
            stripes={false}
            value={0.2}
            className="mt-2 h-1 !bg-zinc-700"
          />

          <p className="bp5-text-muted text-[12.5px] mt-1.5">5.5 Gb used out of 20 Gb</p>
        </Callout>
      </div>
    </>
  );
};

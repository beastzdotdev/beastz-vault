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
import { v4 as uuid } from 'uuid';

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
    childNodes: [
      // eslint-disable-next-line no-constant-condition
      ...(1 >= 1
        ? Array.from({ length: 20 }, () => ({
            id: uuid(),
            icon: 'document' as const,
            label: uuid(),
          }))
        : []),
    ],
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
    <div className="flex flex-col h-full">
      <div className="pt-2">
        <div className="gorilla-profile flex items-center justify-between py-2 mx-1.5 mb-1 cursor-pointer">
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
                  <MenuItem text="Gorilla doc (coming soon)" icon="application" />
                </Menu>
              }
              placement="right-start"
            >
              <Button icon="plus" rightIcon="chevron-right" text="New" />
            </Popover>
            <Button icon="eye-open" text="Activity" />
            <Button icon="updated" text="Recent" />
            <Button icon="people" text="Members" />
            <Button icon="inherited-group" text="Shared" />
            <Button icon="cog" text="Settings" />
          </ButtonGroup>
        </div>

        <div className="my-4"></div>
      </div>

      <div className="flex-1 overflow-y-scroll">
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

        <div className="">
          <ButtonGroup
            fill
            minimal
            vertical
            alignText="left"
            className="px-1.5 pb-1.5 gorilla-sidebar-buttons"
          >
            <Button icon="trash" text="Trash" />
            <Button icon="ninja" text="AI (coming soon)" />
            <Button icon="data-connection" text="23.45 %" />
            <Button icon="help" text="Support & Help" />
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

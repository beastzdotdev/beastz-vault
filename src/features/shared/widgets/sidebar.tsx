import { v4 as uuid } from 'uuid';
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
  Card,
  CardList,
  H3,
} from '@blueprintjs/core';
import logo from '../../../assets/images/profile/doodle-man-1.svg';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { SidebarTree } from '../../../widgets/sidebar-tree';
import { router } from '../../../router';
import { bus, constants, formatFileSize } from '../../../shared';
import { useResize } from '../../../hooks/use-resize.hook';

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
      link: '/xprofile',
    },
  },
];

function validateFileSize(files: FileList | null): files is FileList {
  if (!files?.length) {
    return false;
  }

  if (files?.length > constants.MAX_FILE_COUNT) {
    bus.emit('show-alert', {
      message: `Too many files (more than ${constants.MAX_FILE_COUNT})`,
    });

    return false;
  }

  const fileSizeLimitMessages: { size: string; name: string }[] = [];

  // check size first
  for (const file of files) {
    console.log('='.repeat(20));
    console.log(file);
    console.log(file.size);
    if (file.size > constants.MAX_FILE_UPLOAD_SIZE) {
      fileSizeLimitMessages.push({
        name: file.name,
        size: formatFileSize(file.size),
      });
    }
  }

  // show message for error of size limit
  if (fileSizeLimitMessages.length) {
    bus.emit('show-alert', {
      message: (
        <>
          <H3>This files exceed size limit(~{constants.MAX_FILE_UPLOAD_SIZE_IN_MB}mb)</H3>
          <br />

          <CardList compact className="whitespace-nowrap max-h-64">
            {fileSizeLimitMessages.map(e => (
              <Card className="flex justify-between">
                <p>{e.name}</p>
                <p className="ml-3">{e.size}</p>
              </Card>
            ))}
          </CardList>
        </>
      ),
    });

    return false;
  }

  return true;
}

export const Sidebar = () => {
  const { sidebarRef, sidebarWidth, startResizing } = useResize();
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const fileUploadElement = useRef<HTMLInputElement>(null);
  const folderUploadElement = useRef<HTMLInputElement>(null);

  const onFileUploadChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (!validateFileSize(files)) {
      return;
    }

    // start uploading
    console.log('='.repeat(20));
    console.log(files);
  }, []);

  //TODO figure out how to upload batch size
  const onFolderUploadChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (!validateFileSize(files)) {
      return;
    }

    console.log('='.repeat(20));
    console.log(files);
  }, []);

  return (
    <div
      className="gorilla-sidebar bg-zinc-900 h-screen relative max-w-[600px] min-w-[250px]"
      ref={sidebarRef}
      style={{ width: sidebarWidth }}
      onMouseDown={e => e.preventDefault()}
    >
      <div className="resize-bar" onMouseDown={startResizing}>
        <div className="resize-line"></div>
      </div>

      <div className="flex flex-col h-full">
        <div className="pt-2">
          <div
            className="gorilla-profile flex items-center justify-between py-2 mx-1.5 mb-1 cursor-pointer"
            onClick={() => {
              //TODO this here is temporary
              router.navigate(constants.path.fileStructure);
            }}
          >
            <div className="flex items-center">
              <img width={24} height={24} src={logo} alt="" className="rounded-sm ml-1.5" />

              <p className="ml-2 font-medium">Giorgi Kumelashvili</p>
            </div>

            <Icon icon="expand-all" className="justify-self-end mr-2.5" />
          </div>

          <div>
            <input
              type="file"
              name="file-upload"
              className="hidden"
              ref={fileUploadElement}
              onChange={onFileUploadChange}
              multiple={true}
            />

            <input
              type="file"
              name="folder-upload"
              className="hidden"
              ref={folderUploadElement}
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
                    <MenuItem text="New" icon="document" type="file" />
                    <MenuItem text="Create" icon="folder-new" />
                    <MenuDivider />
                    <MenuItem
                      text="Upload File(s)"
                      icon="document-open"
                      onClick={() => fileUploadElement.current?.click()}
                    />
                    <MenuItem
                      text="Upload Folder"
                      icon="folder-shared-open"
                      onClick={() => folderUploadElement.current?.click()}
                    />
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

        <div className="flex-1 overflow-y-auto z-10">
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
              <Button
                icon="manual"
                text="Guide"
                onClick={() => router.navigate(constants.path.guide)}
              />
              <Button icon="help" text="Support & Help" />
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Button, ButtonGroup, Menu, MenuDivider, MenuItem, Popover, Icon } from '@blueprintjs/core';
import logo from '../../../assets/images/profile/doodle-man-1.svg';
import { useRef, useState } from 'react';
import { SidebarTree } from '../../../widgets/sidebar-tree';
import { router } from '../../../router';
import { constants } from '../../../shared';
import { useResize } from '../../../hooks/use-resize.hook';
import { FileUploadItem } from './file-upload-item';
import { FolderUploadItem } from './folder-upload-item';
import { CreateFolderDialogWidget } from './create-folder-dialog/create-folder-dialog.widget';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from '../state/shared.store';

// const INITIAL_STATE: SidebarNodeInfo[] = [
//   {
//     id: 0,
//     icon: 'folder-close',
//     label: 'Folder -1',
//     childNodes: [],
//   },
//   {
//     id: 1,
//     icon: 'folder-close',
//     label: 'Folder 0',
//     childNodes: [
//       // eslint-disable-next-line no-constant-condition
//       ...(1 >= 1
//         ? Array.from({ length: 20 }, () => ({
//             id: uuid(),
//             icon: 'document' as const,
//             label: uuid(),
//           }))
//         : []),
//     ],
//   },

//   {
//     id: 2,
//     icon: 'folder-close',
//     isExpanded: false,
//     label: 'Folder 1',
//     nodeData: {
//       link: '/profile',
//     },
//     childNodes: [
//       {
//         id: 1,
//         icon: 'document',
//         label: 'Something.txt',
//       },
//       {
//         id: 2,
//         icon: 'document',
//         label: 'Profile-backup.jpg',
//       },

//       {
//         id: 3,
//         label: 'Something',
//       },
//       {
//         id: 4,
//         hasCaret: true,
//         icon: 'folder-close',
//         label: (
//           <ContextMenu content={<div>Hello there!</div>}>
//             <Tooltip content="foo" placement="right">
//               Folder 2
//             </Tooltip>
//           </ContextMenu>
//         ),
//       },
//     ],
//   },
// ];

// const INITIAL_STATE2: SidebarNodeInfo[] = [
//   {
//     id: 0,
//     icon: 'folder-close',
//     label: 'Some stuff',
//     childNodes: [],
//     isExpanded: false,
//   },
//   {
//     id: 1,
//     icon: 'folder-close',
//     label: 'Misc',
//     childNodes: [],
//     isExpanded: false,
//   },
//   {
//     id: 2,
//     icon: 'folder-close',
//     isExpanded: false,
//     label: 'Interseting stuff',
//     nodeData: {
//       link: '/xprofile',
//     },
//   },
// ];

export const Sidebar = observer(() => {
  const { sidebarRef, sidebarWidth, startResizing } = useResize();
  // const [showBookmarks, setShowBookmarks] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const folderUploadRef = useRef<HTMLInputElement>(null);

  const sharedStore = useInjection(SharedStore);

  const [isFolderCreateOpen, setIsFolderCreateOpen] = useState(false);

  return (
    <div
      className="gorilla-sidebar bg-zinc-900 h-screen relative max-w-[600px] min-w-[250px] select-none"
      ref={sidebarRef}
      style={{ width: sidebarWidth }}
    >
      <CreateFolderDialogWidget isOpen={isFolderCreateOpen} setIsOpen={setIsFolderCreateOpen} />

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
            <FileUploadItem inputRef={fileUploadRef} />

            <FolderUploadItem inputRef={folderUploadRef} />

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

                    <MenuItem
                      text="Create"
                      icon="folder-new"
                      onClick={() => {
                        setIsFolderCreateOpen(true);
                      }}
                    />

                    <MenuDivider />
                    <MenuItem
                      text="Upload File(s)"
                      icon="document-open"
                      onClick={() => fileUploadRef.current?.click()}
                    />
                    <MenuItem
                      text="Upload Folder"
                      icon="folder-shared-open"
                      onClick={() => folderUploadRef.current?.click()}
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
          {/*TODO Bookmarks are temporary disabled */}
          {/* <div
            className="hover:bg-zinc-800 active:bg-zinc-700 w-fit ml-3"
            onClick={() => setShowBookmarks(!showBookmarks)}
          >
            <p className="text-xs text-zinc-500 font-bold cursor-pointer">Bookmarks</p>
          </div>
          {showBookmarks && <SidebarTree state={INITIAL_STATE} />} */}

          <div className="my-2"></div>

          <div
            className="hover:bg-zinc-800 active:bg-zinc-700 w-fit ml-3"
            onClick={() => setShowFiles(!showFiles)}
          >
            <p className="text-xs text-zinc-500 font-bold cursor-pointer">Files</p>
          </div>

          {showFiles && (
            <SidebarTree
              state={
                sharedStore.activeFileStructureInRoot?.map(e => ({
                  id: e.id,
                  icon: e.isFile ? 'document' : 'folder-close',
                  label: e.isFile ? e.title + e.fileExstensionRaw : e.title,
                  isExpanded: false,
                  childNodes: e.isFile ? undefined : [],
                  ...(e.isFile
                    ? {
                        nodeData: {
                          isFile: true,
                        },
                      }
                    : {
                        nodeData: {
                          isFile: false,
                          link: e.rootParentId
                            ? `/file-structure?id=${e.id}&root_parent_id=${e.rootParentId}`
                            : `/file-structure?id=${e.id}&root_parent_id=${e.id}`,
                        },
                      }),
                })) ?? []
              }
            />
          )}

          <div className="my-5"></div>

          <div>
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
});

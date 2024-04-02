import {
  Button,
  ButtonGroup,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Icon,
  Tooltip,
} from '@blueprintjs/core';
import { lazy, useRef, useState } from 'react';
import { useInjection } from 'inversify-react';
import { SidebarTree } from '../../../widgets/sidebar-tree';
import { router } from '../../../router';
import { useResize } from '../../../hooks/use-resize.hook';
import { FileUploadItem } from './file-upload/file-upload-item';
import { FolderUploadItem } from './folder-upload/folder-upload-item';
import { CreateFolderDialogWidget } from './create-folder-dialog/create-folder-dialog.widget';
import { SharedStore } from '../state/shared.store';
import { constants } from '../../../shared/constants';

const Logo = lazy(() => import('../../../assets/images/profile/doodle-man-1.svg?react'));

export const Sidebar = () => {
  const { sidebarRef, sidebarWidth, startResizing } = useResize();
  const [showFiles, setShowFiles] = useState(true);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const folderUploadRef = useRef<HTMLInputElement>(null);
  const sharedStore = useInjection(SharedStore);
  const [isFolderCreateOpen, setIsFolderCreateOpen] = useState(false);
  // const [showBookmarks, setShowBookmarks] = useState(true);

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
              <Logo width={24} height={24} className="rounded-sm ml-1.5" />

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
          {/* <div className="p-1.5">
            <div className="flex items-center mb-2">
              <div
                className="hover:bg-zinc-800 active:bg-zinc-700 w-fit ml-2"
                onClick={() => setShowBookmarks(!showBookmarks)}
              >
                <p className="text-xs text-zinc-500 font-bold cursor-pointer">Bookmarks</p>
              </div>
            </div>

            {showBookmarks && <SidebarTree />}
          </div> */}

          <div className="my-2"></div>

          <div className="p-1.5">
            <div className="flex items-center mb-2">
              <div
                className="hover:bg-zinc-800 active:bg-zinc-700 w-fit ml-2"
                onClick={() => setShowFiles(!showFiles)}
              >
                <p className="text-xs text-zinc-500 font-bold cursor-pointer">Files</p>
              </div>

              <Tooltip
                content="Expand all"
                placement="bottom"
                intent="none"
                compact
                canEscapeKeyClose={false}
                hoverOpenDelay={500}
              >
                <Icon
                  onClick={() => sharedStore.toggleAllExpand(true)}
                  icon="expand-all"
                  className="!text-zinc-500 hover:bg-zinc-800 active:bg-zinc-700 p-0.5 ml-2 cursor-pointer"
                  size={13}
                />
              </Tooltip>

              <Tooltip
                content="Collapse all"
                placement="bottom"
                intent="none"
                compact
                canEscapeKeyClose={false}
                hoverOpenDelay={500}
              >
                <Icon
                  onClick={() => sharedStore.toggleAllExpand(false)}
                  icon="collapse-all"
                  className="!text-zinc-500 hover:bg-zinc-800 active:bg-zinc-700 p-0.5 ml-1 cursor-pointer"
                  size={13}
                />
              </Tooltip>

              <Tooltip
                content="Go to root"
                placement="bottom"
                intent="none"
                compact
                canEscapeKeyClose={false}
                hoverOpenDelay={500}
              >
                <Icon
                  onClick={() => router.navigate(constants.path.fileStructure)}
                  icon="selection"
                  className="!text-zinc-500 hover:bg-zinc-800 active:bg-zinc-700 p-0.5 ml-1 cursor-pointer"
                  size={13}
                />
              </Tooltip>
            </div>

            <SidebarTree className={showFiles ? '' : '!hidden'} />
          </div>

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
};

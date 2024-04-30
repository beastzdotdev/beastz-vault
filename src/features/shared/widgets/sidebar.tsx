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
import { useRef, useState } from 'react';
import { useInjection } from 'inversify-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SidebarTree } from '../../../widgets/sidebar-tree';
import { useResize } from '../../../hooks/use-resize.hook';
import { FileUploadItem } from './file-upload/file-upload-item';
import { FolderUploadItem } from './folder-upload/folder-upload-item';
import { CreateFolderDialog } from './create-folder-dialog/create-folder-dialog';
import { SharedStore } from '../state/shared.store';
import { constants } from '../../../shared/constants';
import { ProfileIcon } from './profile';
import { StorageLimitIndicator } from './general/storage-limit-indicator';
import { CreateFileDialog } from './create-file/create-file-dialog';

export const Sidebar = () => {
  const { sidebarRef, sidebarWidth, startResizing } = useResize();
  const [showFiles, setShowFiles] = useState(true);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const folderUploadRef = useRef<HTMLInputElement>(null);
  const sharedStore = useInjection(SharedStore);
  const [isFolderCreateOpen, setIsFolderCreateOpen] = useState(false);
  const [isCreateFileOpen, setIsCreateFileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="beastz-vault-sidebar bg-zinc-900 h-screen max-w-[600px] min-w-[250px] select-none sticky top-0"
      ref={sidebarRef}
      style={{ width: sidebarWidth }}
    >
      <CreateFolderDialog isOpen={isFolderCreateOpen} setIsOpen={setIsFolderCreateOpen} />
      <CreateFileDialog isOpen={isCreateFileOpen} toggleIsOpen={setIsCreateFileOpen} />

      <div className="resize-bar" onMouseDown={startResizing}>
        <div className="resize-line"></div>
      </div>

      <div className="flex flex-col h-full">
        <div className="pt-2">
          <ProfileIcon />

          <div>
            <FileUploadItem inputRef={fileUploadRef} />

            <FolderUploadItem inputRef={folderUploadRef} />

            <ButtonGroup
              fill
              minimal
              vertical
              alignText="left"
              className="px-1.5 pb-1.5 beastz-vault-sidebar-buttons"
            >
              <Popover
                content={
                  <Menu>
                    <MenuItem
                      text="New"
                      icon="document"
                      type="file"
                      onClick={() => setIsCreateFileOpen(true)}
                    />

                    <MenuItem
                      text="Create"
                      icon="folder-new"
                      onClick={() => setIsFolderCreateOpen(true)}
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
                    <MenuItem disabled text="beastz-vault doc (coming soon)" icon="application" />
                  </Menu>
                }
                placement="right-start"
              >
                <Button icon="plus" rightIcon="chevron-right" text="New" />
              </Popover>

              <Button icon="updated" text="Recent" disabled />
              <Button icon="cog" text="Settings" disabled />
            </ButtonGroup>
          </div>

          <div className="my-4"></div>
        </div>

        <div className="flex-1 overflow-y-hidden hover:overflow-y-auto z-10">
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
                  onClick={() => {
                    sharedStore.toggleAllSelected(false);
                    sharedStore.toggleAllExpand(false);
                    navigate(constants.path.fileStructure + '?id=root');
                  }}
                  icon="home"
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
              className="px-1.5 pb-1.5 beastz-vault-sidebar-buttons"
            >
              <Popover
                content={
                  <Menu>
                    <MenuItem disabled icon="eye-open" text="Activity" />
                    <MenuItem disabled icon="people" text="Members" />
                    <MenuItem disabled icon="inherited-group" text="Shared" />
                    <MenuDivider />
                    <MenuItem disabled icon="ninja" text="AI" />
                  </Menu>
                }
                placement="right-start"
              >
                <Button icon="clean" rightIcon="chevron-right" text="Comming soon" />
              </Popover>

              <NavLink to={constants.path.bin}>
                {params => <Button icon="trash" text="Bin" active={params.isActive} />}
              </NavLink>

              <NavLink to={constants.path.guide}>
                {params => <Button icon="manual" text="Guide" active={params.isActive} />}
              </NavLink>

              <NavLink to={constants.path.support}>
                {params => <Button icon="help" text="Support & Help" active={params.isActive} />}
              </NavLink>

              <StorageLimitIndicator />
              <p className="text-xs text-gray-500 text-muted mx-2.5 mt-1.5">
                version {constants.VERSION}
              </p>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Button, Icon, Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { FileMimeType } from '../../../shared/enum/file-mimte-type.enum';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from '../../shared/state/shared.store';
import { SharedController } from '../../shared/state/shared.controller';
import { useNavigate } from 'react-router-dom';

interface FileStuructureFileItemParams {
  userName: string;
  isSelected: boolean;
  onSelected: (id: number) => void;
  onDoubleClick: (value: FileStuructureFileItemParams) => void;

  id: number;
  path: string;
  title: string;
  depth: number;
  color: string | null;
  sizeInBytes: number | null;
  fileExstensionRaw: string | null;
  mimeTypeRaw: string | null;
  mimeType: FileMimeType | null;
  isEditable: boolean | null;
  lastModifiedAt: Date | null;
  isFile: boolean;
  createdAt: Date;
  rootParentId: number | null;
  parentId: number | null;
}

const FileStuructureFileItem = (params: FileStuructureFileItemParams): React.JSX.Element => {
  return (
    <div
      className={`gorilla-file-structure-item group/gorilla-item ${
        params.isSelected ? 'gorilla-file-structure-item-selected' : ''
      }`}
      onClick={() => params.onSelected(params.id)}
      onDoubleClick={() => params.onDoubleClick(params)}
    >
      {/*//! width 100px behaves like min-width:100px */}
      <div className="flex items-center pl-3 pr-5 flex-grow w-[100px]">
        <Icon icon={params.isFile ? 'document' : 'folder-close'} />
        <p className="pl-2 truncate">
          {params.isFile ? params.title + params.fileExstensionRaw : params.title}
        </p>
      </div>

      <div className="flex flex-grow-0 py-1">
        <div className="flex items-center justify-start w-[200px] pr-5">
          <Icon icon="user" />
          {/* TODO add tooltip */}
          <p className="truncate max-w-[170px] block pl-2">{params.userName}</p>
        </div>

        <div className="flex items-center justify-start w-[200px] pr-5">
          <p>{params.lastModifiedAt?.toDateString()}</p>
        </div>

        <div className="flex items-center justify-start w-[90px] pr-5">
          <p>{params.sizeInBytes}</p>
        </div>
      </div>

      <div className="items-center justify-end flex-grow-0 w-[210px] xl:flex hidden">
        <Button
          icon="share"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="bookmark"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="download"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="edit"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="lock"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="shield"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
      </div>

      <Popover
        content={
          <Menu>
            <MenuItem text="Share" icon="share" />
            <MenuItem text="Bookmark" icon="bookmark" />
            <MenuItem text="Copy" icon="duplicate">
              <MenuItem text="Title" />
              <MenuItem text="Public link" />
              <MenuItem text="Content (only file)" />
            </MenuItem>
            <MenuItem text="Move" icon="nest" />
            <MenuDivider />
            <MenuItem text="Add shortcut" icon="folder-new" />
            <MenuItem text="Change color" icon="tint" />
            <MenuItem text="Details" icon="info-sign" />
            <MenuItem text="Activity" icon="list-detail-view" />
            <MenuItem text="Not editable" icon="edit" />
            <MenuItem text="Lock" icon="lock" />
            <MenuItem text="Download" icon="download" />
            <MenuItem text="Open in editor (coming soon)" icon="code" />
            <MenuItem text="Encrypt by" icon="shield">
              <MenuItem text="Text" />
              <MenuItem text="Pin" />
            </MenuItem>
            <MenuDivider />

            <MenuItem text="Move to bin" icon="trash" />
          </Menu>
        }
        placement="right-start"
      >
        <Button icon="more" minimal />
      </Popover>
    </div>
  );
};

export const FileStructureFilesWidget = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);
  const sharedController = useInjection(SharedController);
  const navigate = useNavigate();

  return (
    <div className="gorilla-file-structure">
      {sharedStore.activeFileStructureInBody.map(e => {
        return (
          <FileStuructureFileItem
            {...e}
            userName="Me"
            key={e.id}
            onSelected={id => sharedController.setIsSelectedInActiveFSPage(id)}
            onDoubleClick={value => {
              const { id, isFile, rootParentId, parentId } = value;

              if (isFile) {
                //TODO do stuff for file
                return;
              }

              const redirectUrlObj = new URL(window.location.href);
              redirectUrlObj.searchParams.set('id', id.toString());
              redirectUrlObj.searchParams.set(
                'root_parent_id',
                rootParentId ? rootParentId.toString() : id.toString()
              );
              redirectUrlObj.searchParams.set(
                'parent_id',
                parentId ? parentId.toString() : id.toString()
              );
              const redirectUrl = redirectUrlObj.pathname + redirectUrlObj.search;

              navigate(redirectUrl);
            }}
          />
        );
      })}
    </div>
  );
});

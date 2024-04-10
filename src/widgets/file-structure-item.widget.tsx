import { Button, ContextMenu, Icon, Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useLocation } from 'react-router-dom';
import { formatSize } from '../shared/helper';
import { RootFileStructure } from '../shared/model';
import { FileStructureApiService } from '../shared/api';
import { router } from '../router';

interface FileStuructureFileItemParams {
  isFromBin?: boolean;
  node: RootFileStructure;
  isSelected: boolean;
  onSelected: (node: RootFileStructure) => void;
  onDoubleClick: (node: RootFileStructure) => void;
}

const FileStuructureContextMenu = (params: { node: RootFileStructure }) => {
  const fileStructureApiService = useInjection(FileStructureApiService);
  const location = useLocation();

  const moveToBin = async () => {
    await fileStructureApiService.moveToBin(params.node.id, { isInBin: true });
    router.navigate(location.pathname + location.search);
  };

  return (
    <Menu>
      <MenuItem text="Copy" icon="duplicate">
        <MenuItem text="Title" />
        <MenuItem text="Public link" />
        <MenuItem {...(!params.node.isFile && { disabled: true })} text="Content" />
      </MenuItem>
      <MenuItem text="Move" icon="nest" />
      <MenuDivider />
      <MenuItem text="Change color" icon="tint" />
      <MenuItem text="Details" icon="info-sign" />
      <MenuItem text="Not editable" icon="edit" />
      <MenuItem text="Lock" icon="lock" />
      <MenuItem text="Download" icon="cloud-download" />

      <MenuItem text="Encrypt by" icon="shield">
        <MenuItem text="Text" />
        <MenuItem text="Pin" />
      </MenuItem>

      <MenuDivider />
      <MenuItem text="Coming soon" icon="clean">
        <MenuItem disabled text="Share" icon="share" />
        <MenuItem disabled text="Bookmark" icon="bookmark" />
        <MenuItem disabled text="Add shortcut" icon="folder-new" />
        <MenuItem disabled text="Activity" icon="list-detail-view" />
        <MenuItem disabled text="Open in editor" icon="code" />
      </MenuItem>
      <MenuItem text="Move to bin" icon="trash" onClick={moveToBin} />
    </Menu>
  );
};

const FileStuructureFromBinContextMenu = (params: { node: RootFileStructure }) => {
  return (
    <Menu>
      <MenuItem text="Copy" icon="duplicate">
        <MenuItem text="Title" />
        <MenuItem text="Public link" />
        <MenuItem {...(!params.node.isFile && { disabled: true })} text="Content" />
      </MenuItem>

      <MenuDivider />
      <MenuItem text="Restore" icon="history" />
      <MenuItem text="Delete forever" intent="danger" icon="trash" />
    </Menu>
  );
};

export const FileStuructureFileItem = observer(
  (params: FileStuructureFileItemParams): React.JSX.Element => {
    //
    const contextMenu = params.isFromBin ? (
      <FileStuructureFromBinContextMenu node={params.node} />
    ) : (
      <FileStuructureContextMenu node={params.node} />
    );

    return (
      <ContextMenu content={contextMenu}>
        <div
          className={`gorilla-file-structure-item group/gorilla-item  ${
            params.isSelected ? 'gorilla-file-structure-item-selected' : ''
          }`}
          onClick={() => params.onSelected(params.node)}
          onDoubleClick={() => params.onDoubleClick(params.node)}
          onContextMenu={() => params.onSelected(params.node)}
        >
          {/*//! width 100px behaves like min-width:100px */}
          <div className="flex items-center pl-3 pr-5 flex-grow w-[100px]">
            <Icon icon={params.node.isFile ? 'document' : 'folder-close'} />
            <p className="pl-2 truncate">
              {params.node.isFile
                ? params.node.title + params.node.fileExstensionRaw
                : params.node.title}
            </p>
          </div>

          <div className="flex flex-grow-0 py-1">
            <div className="flex items-center justify-start w-[200px] pr-5">
              <Icon icon="user" />

              <p className="truncate max-w-[170px] block pl-2">{'TODO'}</p>
            </div>

            <div className="flex items-center justify-start w-[200px] pr-5">
              <p>{params.node.lastModifiedAt?.toDateString()}</p>
            </div>

            <div className="flex items-center justify-start w-[110px] pr-5">
              <p>{formatSize(params.node.sizeInBytes)}</p>
            </div>
          </div>

          {!params.isFromBin && (
            <div className="items-center justify-end flex-grow-0 w-[210px] xl:flex hidden">
              {/* Share and bookmark add later */}

              <Button
                icon="cloud-download"
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
          )}

          <Popover content={contextMenu} placement="right-start">
            <Button icon="more" minimal />
          </Popover>
        </div>
      </ContextMenu>
    );
  }
);

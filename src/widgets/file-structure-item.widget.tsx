import {
  Button,
  ContextMenu,
  Icon,
  IconName,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
} from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useMemo } from 'react';
import { differentiate, formatSize } from '../shared/helper';
import { RootFileStructure } from '../shared/model';
import { ProfileStore } from '../features/profile/state/profile.store';

interface FileStuructureFileItemParams {
  isFromBin?: boolean;
  node: RootFileStructure;
  isSelected: boolean;
  onSelected: (node: RootFileStructure) => void;
  onMoveToBin?: (node: RootFileStructure) => void;
  onDoubleClick: (node: RootFileStructure) => void;
  onRestore?: (node: RootFileStructure) => void;
  onDeleteForever?: (node: RootFileStructure) => void;
  onCopy?: (node: RootFileStructure) => void;
  onColorChange?: (node: RootFileStructure) => void;
  onDetails?: (node: RootFileStructure) => void;
  onDownload?: (node: RootFileStructure) => void;
}

const FileStuructureContextMenu = (params: {
  node: RootFileStructure;
  onMoveToBin?: (node: RootFileStructure) => void;
  onCopy?: (node: RootFileStructure) => void;
  onColorChange?: (node: RootFileStructure) => void;
  onDetails?: (node: RootFileStructure) => void;
  onDownload?: (node: RootFileStructure) => void;
}) => {
  return (
    <Menu>
      <MenuItem text="Copy tittle" icon="duplicate" onClick={() => params.onCopy?.(params.node)} />
      <MenuItem text="Public link" icon="link" />
      <MenuItem text="Move" icon="nest" />
      <MenuDivider />
      <MenuItem
        text="Change color"
        icon="tint"
        onClick={() => params.onColorChange?.(params.node)}
      />
      <MenuItem text="Details" icon="info-sign" onClick={() => params.onDetails?.(params.node)} />
      <MenuItem text="Not editable" icon="edit" />
      <MenuItem text="Lock" icon="lock" />
      <MenuItem
        text="Download"
        icon="cloud-download"
        onClick={() => params.onDownload?.(params.node)}
      />

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
      <MenuItem text="Move to bin" icon="trash" onClick={() => params.onMoveToBin?.(params.node)} />
    </Menu>
  );
};

const FileStuructureFromBinContextMenu = (params: {
  node: RootFileStructure;
  onRestore?: (node: RootFileStructure) => void;
  onDeleteForever?: (node: RootFileStructure) => void;
  onCopy?: (node: RootFileStructure) => void;
  onDetails?: (node: RootFileStructure) => void;
}) => {
  return (
    <Menu>
      <MenuItem text="Copy tittle" icon="duplicate" onClick={() => params.onCopy?.(params.node)} />
      <MenuItem text="Details" icon="info-sign" onClick={() => params.onDetails?.(params.node)} />
      <MenuDivider />
      <MenuItem text="Restore" icon="history" onClick={() => params.onRestore?.(params.node)} />
      <MenuItem
        text="Delete forever"
        intent="danger"
        icon="trash"
        onClick={() => params.onDeleteForever?.(params.node)}
      />
    </Menu>
  );
};

export const FileStuructureFileItem = observer(
  (params: FileStuructureFileItemParams): React.JSX.Element => {
    const profileStore = useInjection(ProfileStore);

    const fsIconResolved = useMemo((): IconName => {
      if (!params.node.mimeType) {
        return 'folder-close';
      }

      switch (differentiate(params.node.mimeType)) {
        case 'audio':
          return 'music';
        case 'image':
          return 'media';
        case 'video':
          return 'video';
        case 'other':
        case 'text':
        default:
          return 'document';
      }
    }, [params.node.mimeType]);

    //
    const contextMenu = params.isFromBin ? (
      <FileStuructureFromBinContextMenu
        node={params.node}
        onRestore={params.onRestore}
        onDeleteForever={params.onDeleteForever}
        onCopy={params.onCopy}
        onDetails={params.onDetails}
      />
    ) : (
      <FileStuructureContextMenu
        node={params.node}
        onMoveToBin={params.onMoveToBin}
        onCopy={params.onCopy}
        onColorChange={params.onColorChange}
        onDetails={params.onDetails}
        onDownload={params.onDownload}
      />
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
            <Icon icon={fsIconResolved} color={params.node.color ?? undefined} />

            <p className="pl-2 truncate">
              {params.node.isFile
                ? params.node.title + params.node.fileExstensionRaw
                : params.node.title}
            </p>
          </div>

          <div className="flex flex-grow-0 py-1">
            <div className="flex items-center justify-start w-[200px] pr-5">
              <Icon icon="user" />

              <p className="truncate max-w-[170px] block pl-2">{profileStore.user.userName}</p>
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
                onClick={e => {
                  e.stopPropagation();
                  params.onDownload?.(params.node);
                }}
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

              <Button
                icon="trash"
                minimal
                className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
                onClick={e => {
                  e.stopPropagation();
                  params.onMoveToBin?.(params.node);
                }}
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

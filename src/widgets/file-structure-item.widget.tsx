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
import { FileMimeType } from '../shared/enum/file-mimte-type.enum';

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
  onEncrypt?: (node: RootFileStructure) => void;
}

export const FileStuructureContextMenu = (params: {
  node: RootFileStructure;
  onMoveToBin?: (node: RootFileStructure) => void;
  onCopy?: (node: RootFileStructure) => void;
  onColorChange?: (node: RootFileStructure) => void;
  onDetails?: (node: RootFileStructure) => void;
  onDownload?: (node: RootFileStructure) => void;
  onEncrypt?: (node: RootFileStructure) => void;
}) => {
  return (
    <Menu>
      <MenuItem text="Copy tittle" icon="duplicate" onClick={() => params.onCopy?.(params.node)} />

      <MenuDivider />
      <MenuItem
        text="Change color"
        icon="tint"
        onClick={() => params.onColorChange?.(params.node)}
      />
      <MenuItem text="Details" icon="info-sign" onClick={() => params.onDetails?.(params.node)} />

      {params.node.isFile && (
        <>
          {/* TODO */}
          {/* <MenuItem
            text={params.node.isEditable ? 'Diable editing' : 'Make editable'}
            icon={params.node.isEditable ? 'cross' : 'edit'}
          />

          <MenuItem
            text={params.node.isLocked ? 'Unlock' : 'Lock'}
            icon={params.node.isLocked ? 'unlock' : 'lock'}
          /> */}

          {/* TODO for now only for text */}
          {params.node.mimeType === FileMimeType.TEXT_PLAIN && (
            <MenuItem
              text="Encrypt"
              icon="shield"
              onClick={() => params.onEncrypt?.(params.node)}
            />
          )}
        </>
      )}

      <MenuItem
        text="Download"
        icon="cloud-download"
        onClick={() => params.onDownload?.(params.node)}
      />

      <MenuDivider />
      <MenuItem text="Coming soon" icon="clean">
        <MenuItem disabled text="Diable editing" icon="cross" />
        <MenuItem disabled text="Lock" icon="lock" />

        <MenuItem disabled text="Public link" icon="link" />
        <MenuItem disabled text="Move" icon="nest" />
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

      //* some other icon option
      // control
      // widget-footer
      // square
      // column-layout
      // th-list
      // application

      switch (differentiate(params.node.mimeType)) {
        case 'text':
          return 'document';
        case 'audio':
          return 'music';
        case 'image':
          return 'media';
        case 'video':
          return 'video';

        // all other
        case 'byte':
        case 'other':
        default:
          return 'square';
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
        onEncrypt={params.onEncrypt}
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
              <Button
                icon="cloud-download"
                minimal
                className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
                onClick={() => params.onDownload?.(params.node)}
              />
              {params.node.isFile && (
                <Button
                  icon="shield"
                  minimal
                  className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
                  onClick={() => params.onEncrypt?.(params.node)}
                />
              )}
              <Button
                icon="info-sign"
                minimal
                className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
                onClick={() => params.onDetails?.(params.node)}
              />
              <Button
                icon="tint"
                minimal
                className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
                onClick={() => params.onColorChange?.(params.node)}
              />
              <Button
                icon="trash"
                minimal
                className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
                onClick={() => params.onMoveToBin?.(params.node)}
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

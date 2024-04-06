import { Button, Icon, Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { formatFileSize } from '../../../shared/helper';
import { RootFileStructure } from '../../../shared/model';

interface FileStuructureFileItemParams {
  node: RootFileStructure;
  isSelected: boolean;
  onSelected: (node: RootFileStructure) => void;
  onDoubleClick: (node: RootFileStructure) => void;
}

export const FileStuructureFileItem = observer(
  (params: FileStuructureFileItemParams): React.JSX.Element => {
    return (
      <div
        className={`gorilla-file-structure-item group/gorilla-item  ${
          params.isSelected ? 'gorilla-file-structure-item-selected' : ''
        }`}
        onClick={() => params.onSelected(params.node)}
        onDoubleClick={() => params.onDoubleClick(params.node)}
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
            <p>{formatFileSize(params.node.sizeInBytes)}</p>
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
  }
);

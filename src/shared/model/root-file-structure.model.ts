import { IconName, MaybeElement, TreeNodeInfo } from '@blueprintjs/core';
import { JSX } from 'react';
import { FileMimeType } from '../enum/file-mimte-type.enum';
import { runInAction } from 'mobx';
import { Type, plainToInstance } from 'class-transformer';
import { BasicFileStructureResponseDto } from '..';

export type SidebarNodeData = { link?: string };

export class RootFileStructure implements TreeNodeInfo<SidebarNodeData> {
  //! From BasicFileStructureInRootDto
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
  isFile: boolean;

  rootParentId: number | null;
  parentId: number | null;

  //! From original TreeNodeInfo
  className?: string | undefined;
  childNodes?: TreeNodeInfo<SidebarNodeData>[] | undefined;
  disabled?: boolean | undefined;
  hasCaret?: boolean | undefined;
  icon?: IconName | MaybeElement;
  isExpanded?: boolean | undefined;
  isSelected?: boolean | undefined;
  label: string | JSX.Element;
  secondaryLabel?: string | MaybeElement;
  nodeData?: SidebarNodeData | undefined;

  @Type(() => Date)
  lastModifiedAt: Date | null;

  @Type(() => Date)
  createdAt: Date;

  //! Do not use @Type here it will make class serialization slower
  children: RootFileStructure[];

  toggleIsExpanded() {
    this.isExpanded = !this.isExpanded;
  }
  setIsExpanded(value: boolean) {
    this.isExpanded = value;
  }

  setIsSelected(value: boolean) {
    this.isSelected = value;
  }

  static customTransform(data: BasicFileStructureResponseDto): RootFileStructure {
    return runInAction(() => {
      const newItem = plainToInstance(RootFileStructure, data);

      newItem.icon = data.isFile ? 'document' : 'folder-close';
      newItem.label = data.isFile ? data.title + data.fileExstensionRaw : data.title;
      newItem.isExpanded = false;
      newItem.childNodes = data.isFile ? undefined : [];

      if (data.isFile) {
        newItem.nodeData = {};
      } else {
        newItem.nodeData = {
          link: data.rootParentId
            ? `/file-structure?id=${data.id}&root_parent_id=${
                data.rootParentId
              }&path=${encodeURIComponent(data.path)}`
            : `/file-structure?id=${data.id}&root_parent_id=${data.id}&path=${encodeURIComponent(
                data.path
              )}`,
        };
      }

      newItem.hasCaret = false;
      if (data?.children?.length) {
        newItem.children = data.children.map(e => this.customTransform(e));
        newItem.childNodes = newItem.children; // chilod node are only reference
        newItem.hasCaret = true;

        return newItem;
      } else {
        return newItem;
      }
    });
  }
}

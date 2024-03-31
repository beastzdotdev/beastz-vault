import { IconName } from '@blueprintjs/core';
import { FileMimeType } from '../enum/file-mimte-type.enum';
import { makeAutoObservable, runInAction } from 'mobx';
import { Type, plainToInstance } from 'class-transformer';
import { BasicFileStructureResponseDto, Combine } from '..';
import { MobxTreeModel } from '@pulexui/core';

export class RootFileStructure
  implements Combine<BasicFileStructureResponseDto, MobxTreeModel<number>>
{
  constructor() {
    makeAutoObservable(this);
  }

  //! inherited
  id: number;
  name: string;
  children: RootFileStructure[]; //! Do not use @Type here it will make class serialization slower
  isSelected: boolean;
  isExpanded: boolean;
  isFile: boolean;

  //! From BasicFileStructureInRootDto
  path: string;
  title: string;
  depth: number;
  color: string | null;
  sizeInBytes: number | null;
  fileExstensionRaw: string | null;
  mimeTypeRaw: string | null;
  mimeType: FileMimeType | null;
  isEditable: boolean | null;
  rootParentId: number | null;
  parentId: number | null;

  //! New
  link?: string;
  activeIcon: IconName;

  @Type(() => Date)
  lastModifiedAt: Date | null;

  @Type(() => Date)
  createdAt: Date;

  toggleIsExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  setIsExpanded(value: boolean) {
    this.isExpanded = value;
  }

  setIsSelected(value: boolean) {
    this.isSelected = value;
  }

  recusive(node: RootFileStructure[], callback?: (node: RootFileStructure) => void): void {
    for (let i = 0; i < node?.length; i++) {
      callback?.(node[i]);

      if (node[i].children !== undefined) {
        this.recusive(node[i].children, callback);
      }
    }
  }

  static customTransform(data: BasicFileStructureResponseDto): RootFileStructure {
    return runInAction(() => {
      const newItem = plainToInstance(RootFileStructure, data);

      newItem.name = data.isFile ? data.title + data.fileExstensionRaw : data.title;
      newItem.isSelected = false;
      newItem.isExpanded = false;
      newItem.activeIcon = data.isFile ? 'document' : 'folder-close';

      if (!data.isFile) {
        newItem.link = data.rootParentId
          ? `/file-structure?id=${data.id}&root_parent_id=${
              data.rootParentId
            }&path=${encodeURIComponent(data.path)}`
          : `/file-structure?id=${data.id}&root_parent_id=${data.id}&path=${encodeURIComponent(
              data.path
            )}`;
      }

      if (data?.children?.length) {
        newItem.children = data.children.map(e => this.customTransform(e));
        return newItem;
      } else {
        return newItem;
      }
    });
  }
}
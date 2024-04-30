import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared/ioc';
import { RootFileStructure } from '../../../shared/model';
import { GetGeneralInfoResponseDto } from '../../../shared/api';

@Singleton
export class SharedStore {
  private _shouldRender: boolean;
  private _activeRootFileStructure: RootFileStructure[];
  private _activeBodyFileStructure: RootFileStructure[];
  private _generalInfo: GetGeneralInfoResponseDto;

  constructor() {
    makeAutoObservable(this);
  }

  get shouldRender(): boolean {
    return this._shouldRender;
  }

  get activeRootFileStructure(): RootFileStructure[] {
    return this._activeRootFileStructure;
  }

  get activeBodyFileStructure(): RootFileStructure[] {
    return this._activeBodyFileStructure;
  }

  get generalInfo(): GetGeneralInfoResponseDto {
    return this._generalInfo;
  }

  //====================================================
  // Chose methods for setter instead of set keyword
  //====================================================

  setShouldRender(value: boolean) {
    this._shouldRender = value;
  }

  setActiveRootFileStructure(value: RootFileStructure[]) {
    this._activeRootFileStructure = value;
  }

  setGeneralInfo(value: GetGeneralInfoResponseDto) {
    this._generalInfo = value;
  }

  setActiveBodyFileStructure(value: RootFileStructure[]) {
    this._activeBodyFileStructure = value;
  }

  //====================================================
  // Additional methods
  //====================================================

  pushActiveRootFileStructure(value: RootFileStructure) {
    this._activeRootFileStructure.push(value);
  }

  replaceActiveRootFileStructure(value: RootFileStructure) {
    // find by path and type because file and folder can have same path in same parent
    const index = this._activeRootFileStructure.findIndex(e => e.path === value.path);

    if (index !== -1) {
      this._activeRootFileStructure[index] = value;
    }
  }

  searchNode(nodes: RootFileStructure[], id: number): RootFileStructure | null {
    for (let i = 0; i < nodes?.length; i++) {
      if (nodes[i].id === id) {
        return nodes[i];
      }

      const found = this.searchNode(nodes[i]?.children ?? [], id);

      if (found) {
        return found;
      }
    }

    return null;
  }

  searchNodeAndParents(
    nodes: RootFileStructure[],
    id: number,
    parents: RootFileStructure[] = []
  ): RootFileStructure[] | null {
    for (let i = 0; i < nodes?.length; i++) {
      const node = nodes[i];
      const updatedParents = parents.concat(node);

      if (node.id === id) {
        return updatedParents;
      }
      if (node.children) {
        const found = this.searchNodeAndParents(node.children, id, updatedParents);
        if (found) return found;
      }
    }

    return null;
  }

  recusive(nodes: RootFileStructure[], cb?: (node: RootFileStructure) => void): void {
    for (let i = 0; i < nodes?.length; i++) {
      cb?.(nodes[i]);

      if (nodes[i].children !== undefined) {
        this.recusive(nodes[i].children, cb);
      }
    }
  }

  toggleAllExpand(value: boolean) {
    this.recusive(this._activeRootFileStructure, node => (node.isExpanded = value));
  }

  toggleAllSelected(value: boolean) {
    this.recusive(this._activeRootFileStructure, node => (node.isSelected = value));
  }
}

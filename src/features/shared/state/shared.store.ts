import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared/ioc';
import { RootFileStructure } from '../../../shared/model';

@Singleton
export class SharedStore {
  private _activeId: number | 'root';
  private _activeRootParentId?: number;

  private _shouldRender: boolean;
  private _activeRootFileStructure: RootFileStructure[];

  constructor() {
    makeAutoObservable(this);
  }

  get isRoot(): boolean {
    return this._activeId === 'root';
  }

  get shouldRender(): boolean {
    return this._shouldRender;
  }

  get activeRootFileStructure(): RootFileStructure[] {
    return this._activeRootFileStructure;
  }

  get activeId(): number | 'root' {
    return this._activeId;
  }

  get activeRootParentId(): number | undefined {
    return this._activeRootParentId;
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

  //====================================================
  // Additional methods
  //====================================================

  setRouterParams(activeId: number | 'root', rootParentId?: number) {
    this._activeId = activeId;
    this._activeRootParentId = rootParentId;
  }

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

  search(node: RootFileStructure[], id: number): RootFileStructure | null {
    for (let i = 0; i < node?.length; i++) {
      if (node[i].id === id) {
        return node[i];
      }

      const found = this.search(node[i]?.children ?? [], id);

      if (found) {
        return found;
      }
    }

    return null;
  }

  recusive(node: RootFileStructure[], cb?: (node: RootFileStructure) => void): void {
    for (let i = 0; i < node?.length; i++) {
      cb?.(node[i]);

      if (node[i].children !== undefined) {
        this.recusive(node[i].children, cb);
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

import { makeAutoObservable } from 'mobx';
import { BasicFileStructureInBodyDto } from './shared.type';
import { Singleton } from '../../../shared/ioc';
import { RootFileStructure } from '../../../shared/model';

@Singleton
export class SharedStore {
  private _activeId: number | 'root';
  private _activeRootParentId?: number;

  private _shouldRender: boolean;
  private _activeFileStructureInBody: BasicFileStructureInBodyDto[];
  private _activeRootFileStructure: RootFileStructure[];

  constructor() {
    makeAutoObservable(this);
  }

  get isRoot(): boolean {
    return this._activeId === 'root';
  }
  get isNotRoot(): boolean {
    return !this.isRoot;
  }

  get shouldRender(): boolean {
    return this._shouldRender;
  }

  get activeFileStructureInBody(): BasicFileStructureInBodyDto[] {
    return this._activeFileStructureInBody;
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
  setActiveFileStructureInBody(value: BasicFileStructureInBodyDto[]) {
    this._activeFileStructureInBody = value;
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

  pushActiveFileStructureInBody(value: BasicFileStructureInBodyDto) {
    this._activeFileStructureInBody.push(value);
  }
  replaceActiveFileStructureInBody(value: BasicFileStructureInBodyDto) {
    const index = this._activeFileStructureInBody.findIndex(e => e.path === value.path);

    if (index !== -1) {
      this._activeFileStructureInBody[index] = value;
    }
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

  setIsSelectedInActiveFSPage(id: number) {
    this._activeFileStructureInBody.forEach(e => {
      e.setIsSelected(e.id === id);
    });
  }

  search(id: number): RootFileStructure | null {
    for (const child of this._activeRootFileStructure) {
      if (child.isFile) {
        continue;
      }

      const node = this._searchHelper(child, id);
      if (node) {
        return node;
      }
    }

    return null;
  }

  forEachNode(callback: (node: RootFileStructure) => void): void {
    for (const child of this._activeRootFileStructure) {
      if (child.isFile) {
        continue;
      }

      callback(child);

      this.forEachNodeHelper(child, callback);
    }
  }

  expandAll() {
    this.forEachNode(node => (node.isExpanded = true));
  }
  collapseAll() {
    this.forEachNode(node => (node.isExpanded = false));
  }

  //====================================================
  // Helpers (Private)
  //====================================================

  private _searchHelper(node: RootFileStructure, id: number): RootFileStructure | null {
    if (!node) return null;
    if (node.id === id) return node;

    for (const child of node.children) {
      if (child.isFile) {
        continue;
      }

      const node = this._searchHelper(child, id);
      if (node) {
        return node;
      }
    }

    return null;
  }

  private forEachNodeHelper(
    node: RootFileStructure,
    callback: (node: RootFileStructure) => void
  ): void {
    if (!node) return;

    for (const child of node.children) {
      if (child.isFile) {
        continue;
      }

      callback(child);

      this.forEachNodeHelper(child, callback);
    }
  }
}

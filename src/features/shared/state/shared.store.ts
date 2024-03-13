import { makeAutoObservable } from 'mobx';
import { BasicFileStructureInRootDto, Singleton } from '../../../shared';
import { BasicFileStructureInBodyDto } from './shared.type';

@Singleton
export class SharedStore {
  private _activeId: number | 'root';
  private _activeRootParentId?: number;

  private _shouldRender: boolean;
  private _activeFileStructureInBody: BasicFileStructureInBodyDto[];
  private _activeFileStructureInRoot: BasicFileStructureInRootDto[];

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

  get activeFileStructureInRoot(): BasicFileStructureInRootDto[] {
    return this._activeFileStructureInRoot;
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
  setActiveFileStructureInRoot(value: BasicFileStructureInRootDto[]) {
    this._activeFileStructureInRoot = value;
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

  pushActiveFileStructureInRoot(value: BasicFileStructureInRootDto) {
    this._activeFileStructureInRoot.push(value);
  }

  replaceActiveFileStructureInRoot(value: BasicFileStructureInRootDto) {
    // find by path and type because file and folder can have same path in same parent
    const index = this._activeFileStructureInRoot.findIndex(e => e.path === value.path);

    if (index !== -1) {
      this._activeFileStructureInRoot[index] = value;
    }
  }

  setIsSelectedInActiveFSPage(id: number) {
    this._activeFileStructureInBody.forEach(e => {
      e.setIsSelected(e.id === id);
    });
  }

  search(id: number): BasicFileStructureInRootDto | null {
    for (const child of this.activeFileStructureInRoot) {
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

  //====================================================
  // Helpers (Private)
  //====================================================

  private _searchHelper(
    node: BasicFileStructureInRootDto,
    id: number
  ): BasicFileStructureInRootDto | null {
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
}

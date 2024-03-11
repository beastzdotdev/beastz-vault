import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared';
import { ActiveFileStructure } from './shared.type';

@Singleton
export class SharedStore {
  private _activeId: number | 'root';
  private _activeRootParentId?: number;

  private _shouldRender: boolean;
  private _activeFileStructureInBody: ActiveFileStructure[];
  private _activeFileStructureInRoot: ActiveFileStructure[];

  constructor() {
    makeAutoObservable(this);
  }

  get shouldRender(): boolean {
    return this._shouldRender;
  }

  get activeFileStructureInBody(): ActiveFileStructure[] {
    return this._activeFileStructureInBody;
  }

  get activeFileStructureInRoot(): ActiveFileStructure[] {
    return this._activeFileStructureInRoot;
  }

  get activeId(): number | 'root' {
    return this._activeId;
  }
  get activeRootParentId(): number | undefined {
    return this._activeRootParentId;
  }

  setShouldRender(value: boolean) {
    this._shouldRender = value;
  }
  setActiveFileStructureInBody(value: ActiveFileStructure[]) {
    this._activeFileStructureInBody = value;
  }
  setActiveFileStructureInRoot(value: ActiveFileStructure[]) {
    this._activeFileStructureInRoot = value;
  }

  setRouterParams(activeId: number | 'root', rootParentId?: number) {
    this._activeId = activeId;
    this._activeRootParentId = rootParentId;
  }

  addActiveFileStructureInBody(value: ActiveFileStructure) {
    this.activeFileStructureInBody.push(value);
  }
}

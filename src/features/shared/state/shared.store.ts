import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared';
import { ActiveFileStructure } from './shared.type';

@Singleton
export class SharedStore {
  private _shouldRender: boolean;
  private _activeFileStructureInBody: ActiveFileStructure[];

  constructor() {
    makeAutoObservable(this);
  }

  addActiveFileStructureInBody(value: ActiveFileStructure) {
    this.activeFileStructureInBody.push(value);
  }

  get shouldRender(): boolean {
    return this._shouldRender;
  }

  set shouldRender(value: boolean) {
    this._shouldRender = value;
  }

  get activeFileStructureInBody(): ActiveFileStructure[] {
    return this._activeFileStructureInBody;
  }

  set activeFileStructureInBody(value: ActiveFileStructure[]) {
    this._activeFileStructureInBody = value;
  }
}

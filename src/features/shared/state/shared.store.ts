import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared';

@Singleton
export class SharedStore {
  private _shouldRender: boolean;

  constructor() {
    makeAutoObservable(this);
  }

  public set shouldRender(value: boolean) {
    this._shouldRender = value;
  }

  public get shouldRender(): boolean {
    return this._shouldRender;
  }
}

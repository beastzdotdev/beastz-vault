import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared/ioc';
import { UserSupport } from '../model/user-support.model';

@Singleton
export class UserSupportStore {
  private _data: UserSupport[] = [];
  private _total: number = 0;
  private _singleData: UserSupport;

  constructor() {
    makeAutoObservable(this);
  }

  get isEmpty(): boolean {
    return this._data.length === 0;
  }

  get data(): UserSupport[] {
    return this._data;
  }

  get total(): number {
    return this._total;
  }

  get singleData(): UserSupport {
    return this._singleData;
  }

  //====================================================
  // Chose methods for setter instead of set keyword
  //====================================================
  setData(value: UserSupport[]) {
    this._data = value;
  }

  setTotal(value: number) {
    this._total = value;
  }

  setSingleData(value: UserSupport) {
    this._singleData = value;
  }

  replaceById(id: number, newData: UserSupport) {
    const index = this._data.findIndex(e => e.id === id);

    if (index !== -1) {
      this._data[index] = newData;
      return;
    }
  }
}

import { makeAutoObservable } from 'mobx';
import { RootFileStructure } from '../../../shared/model';
import { Singleton } from '../../../shared/ioc';

@Singleton
export class BinStore {
  private _data: RootFileStructure[] = [];
  private _total: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get data(): RootFileStructure[] {
    return this._data;
  }

  get total(): number {
    return this._total;
  }

  //====================================================
  // Chose methods for setter instead of set keyword
  //====================================================
  setData(value: RootFileStructure[]) {
    this._data = value;
  }

  setTotal(value: number) {
    this._total = value;
  }
}

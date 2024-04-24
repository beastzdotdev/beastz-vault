import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared/ioc';
import { Bin } from '../model/bin.model';

@Singleton
export class BinStore {
  private _data: Bin[] = [];
  private _total: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get data(): Bin[] {
    return this._data;
  }

  get total(): number {
    return this._total;
  }

  //====================================================
  // Chose methods for setter instead of set keyword
  //====================================================
  setData(value: Bin[]) {
    this._data = value;
  }

  setTotal(value: number) {
    this._total = value;
  }
}

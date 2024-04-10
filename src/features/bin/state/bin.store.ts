import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared/ioc';
import { MoveToBin } from '../../../shared/api';

@Singleton
export class BinStore {
  private _data: MoveToBin[] = [];
  private _total: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get data(): MoveToBin[] {
    return this._data;
  }

  get total(): number {
    return this._total;
  }

  //====================================================
  // Chose methods for setter instead of set keyword
  //====================================================
  setData(value: MoveToBin[]) {
    this._data = value;
  }

  setTotal(value: number) {
    this._total = value;
  }
}

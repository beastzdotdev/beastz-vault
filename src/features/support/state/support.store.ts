import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared/ioc';
import { FileStructureBin } from '../../bin/state/file-structure-bin.model';

@Singleton
export class SupportStore {
  private _data: FileStructureBin[] = [];
  private _total: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get data(): FileStructureBin[] {
    return this._data;
  }

  get total(): number {
    return this._total;
  }

  //====================================================
  // Chose methods for setter instead of set keyword
  //====================================================
  setData(value: FileStructureBin[]) {
    this._data = value;
  }

  setTotal(value: number) {
    this._total = value;
  }
}

import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../../shared/ioc';
import { RootFileStructure } from '../../../../shared/model';

@Singleton
export class FileViewStore {
  private _isModalOpen: boolean = false;
  private _isInBin: boolean = false;
  private _item: RootFileStructure;

  constructor() {
    makeAutoObservable(this);
  }

  get isModalOpen(): boolean {
    return this._isModalOpen;
  }

  get isInBin(): boolean {
    return this._isInBin;
  }

  get item(): RootFileStructure {
    return this._item;
  }

  //====================================================
  // Chose methods for setter instead of set keyword
  //====================================================

  setIsModalOpen(value: boolean) {
    this._isModalOpen = value;
  }

  setIsInBin(value: boolean) {
    this._isInBin = value;
  }

  setItem(value: RootFileStructure) {
    this._item = value;
  }
}

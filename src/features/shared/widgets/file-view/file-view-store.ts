import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../../shared/ioc';
import { RootFileStructure } from '../../../../shared/model';

@Singleton
export class FileViewStore {
  private _isModalOpen: boolean = false;
  private _isInBin: boolean = false;
  private _item: RootFileStructure;

  // for text editor
  private _text: string = '';
  private _textSaveLoading: boolean = false;
  private _isTextReadonly: boolean = false;
  private _encryptErrorMessage: null | string = null;

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

  get text(): string {
    return this._text;
  }

  get textSaveLoading(): boolean {
    return this._textSaveLoading;
  }

  get isTextReadonly(): boolean {
    return this._isTextReadonly;
  }

  get encryptErrorMessage(): null | string {
    return this._encryptErrorMessage;
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

  setText(value: string) {
    this._text = value;
  }

  setTextSaveLoading(value: boolean) {
    this._textSaveLoading = value;
  }

  setIsTextReadonly(value: boolean) {
    this._isTextReadonly = value;
  }

  setEncryptErrorMessage(value: null | string) {
    this._encryptErrorMessage = value;
  }

  //====================================================
  // Additional methods
  //====================================================

  clear() {
    this._text = '';
    this._textSaveLoading = false;
    this._isTextReadonly = false;
    this._encryptErrorMessage = null;
  }
}

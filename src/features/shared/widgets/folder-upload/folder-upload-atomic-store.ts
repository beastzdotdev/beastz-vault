import { makeAutoObservable } from 'mobx';
import { WBKTreeNode } from '../../../../shared/advanced-helpers/tree-data';
import { GetDuplicateStatusResponseDto } from '../../../../shared/api';
import { Singleton } from '../../../../shared/ioc';

/**
 * This class is only temporary storage for folder upload
 */
@Singleton
export class FolderUploadAtomicStore {
  private _data: WBKTreeNode[] = [];
  private _totalLength: number = 0;

  private _keepBoth: boolean = false;
  private _duplicates: GetDuplicateStatusResponseDto[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get data(): WBKTreeNode[] {
    return this._data;
  }

  get totalLength(): number {
    return this._totalLength;
  }

  get keepBoth(): boolean {
    return this._keepBoth;
  }

  get duplicates(): GetDuplicateStatusResponseDto[] {
    return this._duplicates;
  }

  resetState() {
    this._data = [];
    this._totalLength = 0;
    this._keepBoth = false;
    this._duplicates = [];
  }

  setFiles(data: WBKTreeNode[]) {
    this._data = data;
  }

  setTotalLength(totalLength: number) {
    this._totalLength = totalLength;
  }

  setKeepBoth(keepBoth: boolean) {
    this._keepBoth = keepBoth;
  }

  setDuplicates(duplicates: GetDuplicateStatusResponseDto[]) {
    this._duplicates = duplicates;
  }
}

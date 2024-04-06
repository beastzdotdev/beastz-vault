import { makeAutoObservable } from 'mobx';
import { GetDuplicateStatusResponseDto } from '../../../../shared/api';
import { Singleton } from '../../../../shared/ioc';

/**
 * This class is only temporary storage for file(s) upload
 */
@Singleton
export class FileUploadAtomicStore {
  private _data: { id: string; file: File }[] = [];
  private _keepBoth: boolean = false;
  private _duplicates: GetDuplicateStatusResponseDto[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get data(): { id: string; file: File }[] {
    return this._data;
  }

  get keepBoth(): boolean {
    return this._keepBoth;
  }

  get duplicates(): GetDuplicateStatusResponseDto[] {
    return this._duplicates;
  }

  resetState() {
    this._keepBoth = false;
    this._data = [];
    this._duplicates = [];
  }

  setFiles(data: { id: string; file: File }[]) {
    this._data = data;
  }

  setKeepBoth(keepBoth: boolean) {
    this._keepBoth = keepBoth;
  }

  setDuplicates(duplicates: GetDuplicateStatusResponseDto[]) {
    this._duplicates = duplicates;
  }
}

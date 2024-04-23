import { makeAutoObservable, runInAction } from 'mobx';
import { Type, plainToInstance } from 'class-transformer';
import { FileStructureBinDto } from '../../../shared/api';
import { RootFileStructure } from '../../../shared/model/root-file-structure.model';

export class FileStructureBin implements FileStructureBinDto {
  constructor() {
    makeAutoObservable(this);
  }

  id: number;
  nameUUID: string;
  path: string;
  userId: number;
  fileStructureId: number;
  fileStructure: RootFileStructure;

  @Type(() => Date)
  createdAt: Date;

  static customTransform(data: FileStructureBinDto): FileStructureBin {
    return runInAction(() => {
      const newItem = plainToInstance(FileStructureBin, data);

      newItem.fileStructure = RootFileStructure.customTransform(newItem.fileStructure);

      return newItem;
    });
  }
}

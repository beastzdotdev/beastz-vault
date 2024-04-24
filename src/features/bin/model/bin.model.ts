import { Type, plainToInstance } from 'class-transformer';
import { makeAutoObservable, runInAction } from 'mobx';
import { BinDto } from '../../../shared/api/bin/bin-api.schema';
import { RootFileStructure } from '../../../shared/model';

export class Bin implements BinDto {
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

  static customTransform(data: BinDto): Bin {
    return runInAction(() => {
      const newItem = plainToInstance(Bin, data);

      newItem.fileStructure = RootFileStructure.customTransform(newItem.fileStructure);

      return newItem;
    });
  }
}

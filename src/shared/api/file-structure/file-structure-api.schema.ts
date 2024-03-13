import { Type, plainToInstance } from 'class-transformer';
import { FileMimeType } from '../../enum/file-mimte-type.enum';
import { makeAutoObservable, runInAction } from 'mobx';
import { BasicFileStructure } from '../..';

export class BasicFileStructureInRootDto implements BasicFileStructure {
  constructor() {
    makeAutoObservable(this);
  }

  id: number;
  path: string;
  title: string;
  depth: number;
  color: string | null;
  sizeInBytes: number | null;
  fileExstensionRaw: string | null;
  mimeTypeRaw: string | null;
  mimeType: FileMimeType | null;
  isEditable: boolean | null;
  isFile: boolean;
  rootParentId: number | null;
  parentId: number | null;

  @Type(() => Date)
  lastModifiedAt: Date | null;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => BasicFileStructureInRootDto)
  children: BasicFileStructureInRootDto[];

  static transformMany<V extends Array<V>>(data: V): BasicFileStructureInRootDto[] {
    return runInAction(() => {
      return plainToInstance<BasicFileStructureInRootDto, V>(BasicFileStructureInRootDto, data, {
        enableImplicitConversion: true,
      });
    });
  }

  static transform<V>(data: V): BasicFileStructureInRootDto {
    return runInAction(() => {
      return plainToInstance<BasicFileStructureInRootDto, V>(BasicFileStructureInRootDto, data, {
        enableImplicitConversion: true,
      });
    });
  }
}

export class DetectDuplicateResponseDto {
  title: string;
  hasDuplicate: boolean;
}

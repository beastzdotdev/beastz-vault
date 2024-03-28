import { makeAutoObservable, runInAction } from 'mobx';
import { BasicFileStructure } from '../../../shared';
import { FileMimeType } from '../../../shared/enum/file-mimte-type.enum';
import { Type, plainToInstance } from 'class-transformer';

export class BasicFileStructureInBodyDto implements BasicFileStructure {
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

  @Type(() => BasicFileStructureInBodyDto)
  children: BasicFileStructureInBodyDto[];

  isSelected: boolean;

  setExtraParams(params: { isSelected: boolean }) {
    this.isSelected = params.isSelected;
  }

  setIsSelected(value: boolean) {
    this.isSelected = value;
  }

  static transformMany<V>(data: V): BasicFileStructureInBodyDto[];
  static transformMany<V extends Array<V>>(data: V): BasicFileStructureInBodyDto[] {
    return runInAction(() => {
      return plainToInstance<BasicFileStructureInBodyDto, V>(BasicFileStructureInBodyDto, data, {
        enableImplicitConversion: true,
      });
    });
  }

  static transform<V>(data: V): BasicFileStructureInBodyDto {
    return runInAction(() => {
      return plainToInstance<BasicFileStructureInBodyDto, V>(BasicFileStructureInBodyDto, data, {
        enableImplicitConversion: true,
      });
    });
  }
}

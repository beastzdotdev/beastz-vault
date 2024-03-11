import { Type } from 'class-transformer';
import { FileMimeType } from '../../enum/file-mimte-type.enum';

export type FileStructure = {
  id: number;
  path: string;
  title: string;
  color: string | null;
  depth: number;
  userId: number;
  sizeInBytes: bigint | null;
  fileExstensionRaw: string | null;
  mimeTypeRaw: string | null;
  mimeType: FileMimeType | null;
  isFile: boolean;
  isShortcut: boolean;
  isInBin: boolean;
  isEncrypted: boolean;
  isEditable: boolean | null;
  isLocked: boolean;
  lastModifiedAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
  rootParentId: number | null;
  parentId: number | null;
};

export class BasicFileStructureResponseDto {
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

  @Type(() => BasicFileStructureResponseDto)
  children: BasicFileStructureResponseDto[];
}

export class DetectDuplicateResponseDto {
  title: string;
  hasDuplicate: boolean;
}

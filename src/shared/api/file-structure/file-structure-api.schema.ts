import { FileMimeType } from '../../enum/file-mimte-type.enum';

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

  lastModifiedAt: Date | null;
  createdAt: Date;
  children: BasicFileStructureResponseDto[] | null;
}

export class DetectDuplicateResponseDto {
  title: string;
  hasDuplicate: boolean;
}

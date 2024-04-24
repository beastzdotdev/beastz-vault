import { BasicFileStructureResponseDto } from '../file-structure';

export class BinDto {
  id: number;
  nameUUID: string;
  path: string;
  userId: number;
  fileStructureId: number;
  createdAt: Date;
  fileStructure: BasicFileStructureResponseDto;
}

import { BasicFileStructureResponseDto } from '../../../shared';

export class ActiveFileStructure extends BasicFileStructureResponseDto {
  isSelected: boolean;

  setExtraParams(params: { isSelected: boolean }) {
    this.isSelected = params.isSelected;
  }
}

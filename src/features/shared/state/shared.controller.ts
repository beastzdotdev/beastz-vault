import { plainToInstance } from 'class-transformer';
import {
  Singleton,
  Inject,
  BasicFileStructureResponseDto,
  FileStructureApiService,
} from '../../../shared';
import { SharedStore } from './shared.store';
import { ActiveFileStructure } from './shared.type';

@Singleton
export class SharedController {
  @Inject(SharedStore)
  private readonly sharedStore: SharedStore;

  @Inject(FileStructureApiService)
  private readonly fileStructureApiService: FileStructureApiService;

  async createFolder(params: { name: string; parentId?: number; rootParentId?: number }) {
    const { data, error } = await this.fileStructureApiService.createFolder(params);

    if (error || !data) {
      console.log('='.repeat(20));
      console.log(error);
      throw new Error('Could not create folder');
    }

    const newData = plainToInstance(ActiveFileStructure, data);
    newData.setExtraParams({
      isSelected: false,
    });

    this.sharedStore.addActiveFileStructureInBody(newData);
  }

  setActiveFileStructureInBody(value: BasicFileStructureResponseDto[]) {
    const newArr = plainToInstance(ActiveFileStructure, value);

    newArr.forEach(e => {
      e.setExtraParams({ isSelected: false });
    });

    this.sharedStore.activeFileStructureInBody = newArr;
  }

  setActiveFileStructureInRoot(value: BasicFileStructureResponseDto[]) {
    const newArr = plainToInstance(ActiveFileStructure, value);

    newArr.forEach(e => {
      e.setExtraParams({ isSelected: false });
    });

    this.sharedStore.activeFileStructureInRoot = newArr;
  }

  setIsSelectedInActiveFSPage(id: number) {
    this.sharedStore.activeFileStructureInBody = this.sharedStore.activeFileStructureInBody.map(
      e => {
        if (e.id === id) {
          e.isSelected = true;
        } else {
          e.isSelected = false;
        }
        return e;
      }
    );
  }

  setShouldRender(value: boolean) {
    this.sharedStore.shouldRender = value;
  }
}

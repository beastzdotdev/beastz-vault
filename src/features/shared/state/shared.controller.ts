import { runInAction, toJS } from 'mobx';
import { Singleton, Inject, BasicFileStructureInRootDto } from '../../../shared';
import { SharedStore } from './shared.store';
import { BasicFileStructureInBodyDto } from './shared.type';

@Singleton
export class SharedController {
  @Inject(SharedStore)
  private readonly sharedStore: SharedStore;

  // @Inject(FileStructureApiService)
  // private readonly fileStructureApiService: FileStructureApiService;

  async createFileStructureInState(data: BasicFileStructureInRootDto, isReplaced: boolean) {
    runInAction(() => {
      //! 1. handle active body state first (check if url and parent id matches)
      if (
        (data.parentId === null && this.sharedStore.isRoot) ||
        data.parentId === this.sharedStore.activeId
      ) {
        const forBody = BasicFileStructureInBodyDto.transform(data);
        forBody.setExtraParams({ isSelected: false });

        isReplaced
          ? this.sharedStore.replaceActiveFileStructureInBody(forBody)
          : this.sharedStore.pushActiveFileStructureInBody(forBody);
      }

      //! 2. handle root data then
      if (data.parentId) {
        const node = this.sharedStore.search(data.parentId);

        // if not found just ignore
        if (!node) {
          return;
        }

        if (isReplaced) {
          const index = node?.children.findIndex(e => e.path === data.path);
          if (index !== -1) {
            node.children[index] = data;
          }
        } else {
          node.children.push(data);
        }
      } else {
        isReplaced
          ? this.sharedStore.replaceActiveFileStructureInRoot(data)
          : this.sharedStore.pushActiveFileStructureInRoot(data);
      }
    });

    console.log('='.repeat(20));
    console.log(toJS(this.sharedStore.activeFileStructureInRoot));
  }

  setFileStructureBodyFromRoot(value: BasicFileStructureInRootDto[]) {
    const newArr = BasicFileStructureInBodyDto.transformMany(value);
    newArr.forEach(e => e.setExtraParams({ isSelected: false }));

    this.sharedStore.setActiveFileStructureInBody(newArr);
  }
}

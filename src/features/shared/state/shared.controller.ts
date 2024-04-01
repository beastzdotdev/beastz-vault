import { runInAction, toJS } from 'mobx';
import { Singleton, Inject, RootFileStructure, FileStructureApiService } from '../../../shared';
import { SharedStore } from './shared.store';
import { BasicFileStructureInBodyDto } from './shared.type';

@Singleton
export class SharedController {
  @Inject(SharedStore)
  private readonly sharedStore: SharedStore;

  @Inject(FileStructureApiService)
  private readonly fileStructureApiService: FileStructureApiService;

  async createFileStructureInState(data: RootFileStructure, isReplaced: boolean) {
    runInAction(() => {
      //! 1. handle active body state first (check if url and parent id matches)
      if (
        (data.parentId === null && this.sharedStore.isRoot) ||
        data.parentId === this.sharedStore.activeId
      ) {
        const forBody = BasicFileStructureInBodyDto.transform(data);

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
          ? this.sharedStore.replaceActiveRootFileStructure(data)
          : this.sharedStore.pushActiveRootFileStructure(data);
      }
    });

    console.log('='.repeat(20));
    console.log(toJS(this.sharedStore.activeRootFileStructure));
  }

  async setAcitveFileInBody(id: number | 'root', rootData?: RootFileStructure[]): Promise<void> {
    // 3. if id is root then ignore because it is already set
    if (id === 'root') {
      this.sharedStore.setActiveFileStructureInBody(
        BasicFileStructureInBodyDto.transformMany(rootData ?? [])
      );
      return;
    }

    if (!id) {
      throw new Error('Sorry, something went wrong');
    }

    // 4. else handle get by id of file structure item (overrides only active file structure)
    const { data, error } = await this.fileStructureApiService.getContent({ parentId: id });

    if (error || !data) {
      throw new Error('Sorry, something went wrong');
    }

    this.sharedStore.setActiveFileStructureInBody(BasicFileStructureInBodyDto.transformMany(data));
  }
}

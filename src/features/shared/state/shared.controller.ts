import { runInAction, toJS } from 'mobx';
import { SharedStore } from './shared.store';
import { Singleton, Inject } from '../../../shared/ioc';
import { RootFileStructure } from '../../../shared/model';
import { getFileStructureUrlParams } from '../helper/get-url-params';
import { FSQueryParams } from '../../file-structure/file-structure.loader';

@Singleton
export class SharedController {
  @Inject(SharedStore)
  private readonly sharedStore: SharedStore;

  // @Inject(FileStructureApiService)
  // private readonly fileStructureApiService: FileStructureApiService;

  async createFileStructureInState(data: RootFileStructure, isReplaced: boolean) {
    runInAction(() => {
      if (data.parentId) {
        const node = this.sharedStore.search(
          this.sharedStore.activeRootFileStructure,
          data.parentId
        );

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

  findFolderNodeForActiveBody(): RootFileStructure[] {
    const activeId = this.sharedStore.activeId;

    if (activeId === 'root') {
      return this.sharedStore.activeRootFileStructure;
    }

    return (
      this.sharedStore.search(this.sharedStore.activeRootFileStructure, activeId)?.children ?? []
    );
  }

  affectHistoryPush(url: string) {
    const { parentId, rootParentId } = getFileStructureUrlParams(
      new URL('http://localhost' + url).href
    );

    if (!parentId) {
      throw new Error('Error causing parent folder');
    }

    // finally set active route params
    this.sharedStore.setRouterParams(parentId, rootParentId);

    return { parentId, rootParentId };
  }

  async checkChildrenAndLoad(parentId: number) {
    // find node based on active
    const foundNode = this.sharedStore.search(this.sharedStore.activeRootFileStructure, parentId);

    if (!foundNode || foundNode.isFile) {
      return;
    }

    if (!foundNode.children.length) {
      // load files from api and push to state
    }
  }

  async selectFolder(query: FSQueryParams) {
    if (query.id === 'root') {
      // clear all
      return;
    }

    const { id, path } = query;

    runInAction(() => {
      this.sharedStore.recusive(this.sharedStore.activeRootFileStructure, node => {
        node.setIsSelected(false); // important for others to not be selected

        if (node.isFile) {
          return;
        }

        if (node.id === id && !node.isSelected) {
          node.setIsSelected(true);
        }

        // expand all parent only
        if (path.startsWith(node.path) && path[node.path.length] === '/' && !node.isExpanded) {
          node.setIsExpanded(true);
        }
      });
    });
  }
}

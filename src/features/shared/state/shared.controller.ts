import { runInAction, toJS } from 'mobx';
import { SharedStore } from './shared.store';
import { Singleton, Inject } from '../../../shared/ioc';
import { RootFileStructure } from '../../../shared/model';
import { getFileStructureUrlParams } from '../helper/get-url-params';
import { FSQueryParams } from '../../file-structure/file-structure.loader';
import { FileStructureApiService } from '../../../shared/api';

@Singleton
export class SharedController {
  @Inject(SharedStore)
  private readonly sharedStore: SharedStore;

  @Inject(FileStructureApiService)
  private readonly fileStructureApiService: FileStructureApiService;

  async createFileStructureInState(data: RootFileStructure, isReplaced: boolean) {
    runInAction(() => {
      if (data.parentId) {
        const node = this.sharedStore.searchNode(
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

    // console.log('='.repeat(20));
    // console.log(toJS(this.sharedStore.activeRootFileStructure));
  }

  findFolderNodeForActiveBody(): RootFileStructure[] {
    const activeId = this.sharedStore.activeId;

    if (activeId === 'root') {
      return this.sharedStore.activeRootFileStructure;
    }

    return (
      this.sharedStore.searchNode(this.sharedStore.activeRootFileStructure, activeId)?.children ??
      []
    );
  }

  affectHistoryPush(url: string) {
    const { parentId, rootParentId, folderPath } = getFileStructureUrlParams(
      new URL('http://localhost' + url).href
    );

    if (!parentId) {
      throw new Error('Error causing parent folder');
    }

    // finally set active route params
    this.sharedStore.setRouterParams(parentId, rootParentId, folderPath);

    return { parentId, rootParentId };
  }

  async checkChildrenAndLoad(parentId: number) {
    // find node based on active
    const foundNode = this.sharedStore.searchNode(
      this.sharedStore.activeRootFileStructure,
      parentId
    );

    if (!foundNode || foundNode.isFile) {
      return;
    }

    if (!foundNode.children?.length) {
      const { data, error } = await this.fileStructureApiService.getContent({
        parentId: foundNode.id,
      });

      if (error) {
        throw new Error('Something went wrong');
      }

      if (data) {
        foundNode.addChildren(data);
      }
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

  async pushToHistory(nodeLink: string | undefined) {
    if (!nodeLink) {
      throw new Error('Node link not found');
    }

    // pushState does not cause refresh or fs loader to execute only update path for reload
    // affect will just set active route params in mobx store
    // finally checkChildrenAndLoad will just check if children does not exist will load in root fs store

    window.history.pushState(undefined, '', nodeLink);
    const { parentId } = this.affectHistoryPush(nodeLink);
    await this.checkChildrenAndLoad(parentId);
  }
}

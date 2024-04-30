import { runInAction } from 'mobx';
import { Singleton, Inject } from '../../../shared/ioc';
import { RootFileStructure } from '../../../shared/model';
import { SharedStore } from './shared.store';
import { getFsUrlParamsLite } from '../helper/get-url-params';

@Singleton
export class SharedController {
  @Inject(SharedStore)
  private readonly sharedStore: SharedStore;

  selectFolderSidebar(id: number, path: string) {
    runInAction(() => {
      const found = this.sharedStore.searchNode(this.sharedStore.activeRootFileStructure, id);

      if (!found) {
        return;
      }

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

  async createFileStructureInState(data: RootFileStructure, isReplaced: boolean) {
    runInAction(() => {
      this.affectRoot(data, isReplaced);
      this.affectBody(data, isReplaced);
    });
  }

  private affectRoot(data: RootFileStructure, isReplaced: boolean) {
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
        node.addChild(data);
      }
    } else {
      isReplaced
        ? this.sharedStore.replaceActiveRootFileStructure(data)
        : this.sharedStore.pushActiveRootFileStructure(data);
    }
  }

  private affectBody(data: RootFileStructure, isReplaced: boolean) {
    // base on this params push to active body if necessary
    const { id, isRoot } = getFsUrlParamsLite();

    const accepted =
      (isRoot && !data.parentId) || (!isRoot && data.parentId && data.parentId === id);

    if (!accepted) {
      return;
    }

    if (isReplaced) {
      const index = this.sharedStore.activeBodyFileStructure.findIndex(e => e.path === data.path);

      if (index !== -1) {
        this.sharedStore.activeBodyFileStructure[index] = data;
      }
    } else {
      // for relocate safety
      if (this.sharedStore.activeBodyFileStructure.findIndex(e => e.id === data.id) === -1) {
        this.sharedStore.activeBodyFileStructure.push(data);
      }
    }
  }
}

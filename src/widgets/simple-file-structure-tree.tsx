import { observer, useLocalObservable } from 'mobx-react-lite';
import { MobxTree } from '@pulexui/core';
import { useCallback, useEffect } from 'react';
import { Icon, Intent, Spinner } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { runInAction } from 'mobx';
import { RootFileStructure } from '../shared/model';
import { FileStructureApiService } from '../shared/api';
import { sleep } from '../shared/helper';

interface Props {
  className?: string;
  onSelect?: (node: RootFileStructure | null) => void;
}

export const SimpleFileStructureTree = observer(({ className, onSelect }: Props) => {
  const fileStructureApiService = useInjection(FileStructureApiService);

  const localStore = useLocalObservable(() => ({
    selectedNode: null as RootFileStructure | null,
    data: [] as RootFileStructure[],

    setSelectedNode(node: RootFileStructure) {
      this.selectedNode = node;

      onSelect?.(node);
    },

    recusive(nodes: RootFileStructure[], cb?: (node: RootFileStructure) => void): void {
      for (let i = 0; i < nodes?.length; i++) {
        cb?.(nodes[i]);

        if (nodes[i].children !== undefined) {
          this.recusive(nodes[i].children, cb);
        }
      }
    },

    async loadInitalData() {
      const response = await fileStructureApiService.getContent({ isFile: false });

      if (response.data) {
        runInAction(() => {
          this.data = response.data ?? [];
        });
      }
    },

    clear() {
      this.data.length = 0;
    },
  }));

  useEffect(
    () => {
      // initial load
      localStore.loadInitalData();

      return () => localStore.clear();
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleNodeClick = useCallback(
    async (node: RootFileStructure) => {
      // 1. It is better to select node first for animation speed
      node.setIsSelected(true);

      // 2. And then recusrively deselect others except the selected node
      localStore.recusive(localStore.data, n => {
        if (n.id !== node.id) {
          n.setIsSelected(false);
        }
      });

      localStore.setSelectedNode(node);
    },
    [localStore]
  );

  const handleNodeToggle = useCallback(
    async (node: RootFileStructure, value: boolean) => {
      if (value && node && !node.children?.length) {
        node.setActiveIcon('spinner');
        node.setHasCaret(false);
        node.setDisabled(true);

        const startTime = new Date(); // Start time
        const { data, error } = await fileStructureApiService.getContent({
          parentId: node.id,
          isFile: false,
        });

        if (error) {
          throw new Error('Something went wrong');
        }

        // Calculate time taken
        const endTime = new Date();

        if (data) {
          node.children?.push(...data);
        }

        // this is necessary because if axios took less than 200ms animation seems weird
        if (endTime.getTime() - startTime.getTime() < 200) {
          // add another 400 ms waiting
          await sleep(400);
        }

        node.setActiveIcon('folder-close');
        node.setHasCaret(true);
        node.setDisabled(false);
      }

      node.setIsExpanded(value);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <MobxTree<number, RootFileStructure>
        compact={false}
        nodes={localStore.data}
        nodeClassName="gorilla-sidebar-tree-node"
        className={className ?? ''}
        onToggle={({ node, value }) => handleNodeToggle(node, value)}
        onClick={({ node }) => handleNodeClick(node)}
        onContextMenu={({ e }) => e.preventDefault()}
        renderTypeIcon={node => {
          if (node.activeIcon === 'spinner') {
            return <Spinner size={20} intent={Intent.PRIMARY} />;
          }

          return <Icon icon={node.activeIcon} />;
        }}
      />
    </>
  );
});

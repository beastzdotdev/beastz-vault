import { useInjection } from 'inversify-react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { MobxTree } from '@pulexui/core';
import { toJS } from 'mobx';
import { useCallback, useEffect } from 'react';
import { Icon, Intent, Spinner } from '@blueprintjs/core';
import { getFileStructureUrlParams } from '../features/shared/helper/get-url-params';
import { router } from '../router';
import { SharedController } from '../features/shared/state/shared.controller';
import { SharedStore } from '../features/shared/state/shared.store';
import { FileStructureApiService } from '../shared/api';
import { RootFileStructure } from '../shared/model';

export const SidebarTree = observer(({ className }: { className?: string }) => {
  const location = useLocation();
  const sharedStore = useInjection(SharedStore);
  const sharedController = useInjection(SharedController);
  const fileStructureApiService = useInjection(FileStructureApiService);

  const revalidateTreeSelectionStatus = useCallback(
    () => {
      if (location.pathname === '/') {
        return;
      }

      const { parentId, folderPath } = getFileStructureUrlParams();

      if (!parentId || !folderPath) {
        return;
      }

      console.log('revalidateTreeSelectionStatus');

      sharedStore.forEachNode(node => {
        if (node.id === parentId && !node.isSelected) {
          node.setIsSelected(true);
        }

        // expand all parent only
        if (
          folderPath.startsWith(node.path) &&
          folderPath[node.path.length] === '/' &&
          !node.isExpanded
        ) {
          node.setIsExpanded(true);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => {
      revalidateTreeSelectionStatus();

      router.subscribe(params => {
        console.log(123);
        console.log(params);
        revalidateTreeSelectionStatus();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleNodeClick = useCallback(
    async (node: RootFileStructure) => {
      console.log('click', toJS(node));

      if (node.isFile) {
        //TODO check if is file and if file show popup just like in root page on double click
        console.log('ignoring file click for now');
        return;
      }

      // 1. It is better to select node first for animation speed
      node.setIsSelected(true);

      // 2. And then recusrively deselect others except the selected node
      node.recusive(sharedStore.activeRootFileStructure, n => {
        if (n.id !== node.id) {
          n.setIsSelected(false);
        }
      });

      //TODO
      if (node && node.link) {
        const existingLocation = window.location;

        const nodeUrlObj = new URL(existingLocation.origin + node.link);
        const existingUrlObj = new URL(existingLocation.href);

        // check node data click happens on same page
        if (
          nodeUrlObj.searchParams.get('id') === existingUrlObj.searchParams.get('id') &&
          nodeUrlObj.searchParams.get('root_parent_id') ===
            existingUrlObj.searchParams.get('root_parent_id')
        ) {
          return;
        }

        window.history.pushState(node.link, '', node.link); // do not cause rerender
        revalidateTreeSelectionStatus();

        const id = new URL(window.location.href).searchParams.get('id');

        if (id) {
          await sharedController.setAcitveFileInBody(parseInt(id));
        }
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleNodeToggle = useCallback(
    async (node: RootFileStructure, value: boolean) => {
      console.log('toggle', toJS(node));

      // if (value === true && node && !node.children?.length) {
      //   const { parentId } = getFileStructureUrlParams();

      //   //TODO why only native properties in MobxTreeModel causes rerender not some added properties
      //   node.setActiveIcon('spinner');
      //   node.name = node.name + Math.random().toFixed(2); //TODO remove

      //   const startTime = new Date(); // Start time
      //   const { data, error } = await fileStructureApiService.getContent({ parentId });

      //   if (error) {
      //     throw new Error('Something went wrong');
      //   }

      //   // Calculate time taken
      //   const endTime = new Date();

      //   if (data) {
      //     node.children?.push(...data);
      //   }

      //   // this is necessary because if axios took less than 200ms animation seems weird
      //   if (endTime.getTime() - startTime.getTime() < 200) {
      //     // add another 200 ms waiting
      //     await sleep(200);
      //   }

      //   node.activeIcon = 'folder-close';
      //   node.name = node.name + Math.random().toFixed(2); //TODO remove
      // }

      // node.setIsExpanded(value);
      node.setActiveIcon('spinner');
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleContextMenu = useCallback(
    async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, node: RootFileStructure) => {
      console.log(toJS(node));
      e.preventDefault();
      console.log('Right Click', e.pageX, e.pageY, toJS(node));
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <MobxTree<number, RootFileStructure>
        compact={false}
        nodes={sharedStore.activeRootFileStructure}
        nodeClassName="gorilla-sidebar-tree-node"
        className={className ?? ''}
        onToggle={({ node, value }) => handleNodeToggle(node, value)}
        onClick={({ node }) => handleNodeClick(node)}
        onContextMenu={({ node, e }) => handleContextMenu(e, node)}
        renderTypeIcon={node => {
          console.log('executed', node.id);

          if (node.activeIcon === 'spinner') {
            return <Spinner size={20} intent={Intent.PRIMARY} />;
          }

          return <Icon icon={node.activeIcon} />;
        }}
      />
    </>
  );
});

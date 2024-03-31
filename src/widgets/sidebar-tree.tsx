import { useInjection } from 'inversify-react';
import { SharedStore } from '../features/shared/state/shared.store';
import { useLocation } from 'react-router-dom';
import { FileStructureApiService, RootFileStructure } from '../shared';
import { observer } from 'mobx-react-lite';
import { MobxTree } from '@pulexui/core';
import { toJS } from 'mobx';
import { useCallback } from 'react';

export const SidebarTree = observer(({ className }: { className?: string }) => {
  const location = useLocation();
  const sharedStore = useInjection(SharedStore);
  const fileStructureApiService = useInjection(FileStructureApiService);

  // const revalidateTreeSelectionStatus = useCallback(() => {
  //   if (location.pathname === '/') {
  //     return;
  //   }

  //   const { parentId, folderPath } = getFileStructureUrlParams();

  //   if (!parentId || !folderPath) {
  //     return;
  //   }

  //   sharedStore.forEachNode(node => {
  //     node.setIsSelected(node.id === parentId);

  //     // expand all parent only
  //     if (folderPath.startsWith(node.path) && folderPath[node.path.length] === '/') {
  //       node.setIsExpanded(true);
  //     }
  //   });

  //   // Check if it's the initial load
  //   if (isInitialLoad) {
  //     setIsInitialLoad(() => false);
  //     setRender(prevRender => !prevRender);
  //     return;
  //   }
  // }, [isInitialLoad, location.pathname, sharedStore]);

  const handleNodeClick = useCallback(
    (node: RootFileStructure) => {
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
      // if (node && node.nodeData?.link) {
      //   const existingLocation = window.location;

      //   const nodeUrlObj = new URL(existingLocation.origin + node.nodeData.link);
      //   const existingUrlObj = new URL(existingLocation.href);

      //   // check node data click happens on same page
      //   if (
      //     nodeUrlObj.searchParams.get('id') === existingUrlObj.searchParams.get('id') &&
      //     nodeUrlObj.searchParams.get('root_parent_id') ===
      //       existingUrlObj.searchParams.get('root_parent_id')
      //   ) {
      //     return;
      //   }

      //   router.navigate(node.nodeData.link).then(e => {
      //     revalidateTreeSelectionStatus();
      //   });
      // }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleNodeToggle = useCallback(
    async (node: RootFileStructure, value: boolean) => {
      console.log('toggle', toJS(node));

      node.setIsExpanded(value);

      //TODO
      // if (value === true) {
      //   if (node && !node.childNodes?.length) {
      //     node.hasCaret = false;
      //     node.disabled = true;
      //     node.secondaryLabel = <Spinner size={20} intent={Intent.PRIMARY} />;
      //     setRender(prevRender => !prevRender);

      //     const startTime = new Date(); // Start time
      //     const { data, error } = await fileStructureApiService.getContent({ parentId: id });

      //     if (error) {
      //       throw new Error('Something went wrong');
      //     }

      //     // Calculate time taken
      //     const endTime = new Date();

      //     if (data) {
      //       for (const item of data) {
      //         node.children?.push(item);
      //         node.childNodes = node.children;
      //       }
      //     }

      //     // this is necessary because if axios took less than 200ms animation seems weird
      //     if (endTime.getTime() - startTime.getTime() < 200) {
      //       // add another 200 ms waiting
      //       await sleep(200);
      //     }

      //     node.hasCaret = true;
      //     node.secondaryLabel = undefined;
      //     node.disabled = false;
      //   }

      //   node?.setIsExpanded(value);
      // } else {
      //   node?.setIsExpanded(value);
      // }
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
        onToggle={handleNodeToggle}
        onClick={handleNodeClick}
        onContextMenu={handleContextMenu}
      />
    </>
  );
});

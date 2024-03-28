import { Intent, Spinner, Tree, TreeProps } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { SharedStore } from '../features/shared/state/shared.store';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FileStructureApiService, RootFileStructure, sleep } from '../shared';
import { getFileStructureUrlParams } from '../features/shared/helper/get-url-params';
import { observer } from 'mobx-react-lite';
import { router } from '../router';

type NodePath = number[];

export const SidebarTree = observer(() => {
  const location = useLocation();

  const sharedStore = useInjection(SharedStore);
  const fileStructureApiService = useInjection(FileStructureApiService);
  const [, setRender] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const revalidateTreeSelectionStatus = useCallback(() => {
    if (location.pathname === '/') {
      return;
    }

    const { parentId, folderPath } = getFileStructureUrlParams();

    if (!parentId || !folderPath) {
      return;
    }

    sharedStore.forEachNode(node => {
      node.setIsSelected(node.id === parentId);

      // expand all parent only
      if (folderPath.startsWith(node.path) && folderPath[node.path.length] === '/') {
        node.setIsExpanded(true);
      }
    });

    // Check if it's the initial load
    if (isInitialLoad) {
      setIsInitialLoad(() => false);
      setRender(prevRender => !prevRender);
      return;
    }
  }, [isInitialLoad, location.pathname, sharedStore]);

  useEffect(() => {
    revalidateTreeSelectionStatus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = useCallback(
    (node: RootFileStructure, _nodePath: NodePath, _e: React.MouseEvent<HTMLElement>) => {
      if (node.isFile) {
        console.log('='.repeat(20));
        console.log('Is file');
        //TODO check if is file and if file show popup just like in root page on double click
        return;
      }

      if (node && node.nodeData?.link) {
        const existingLocation = window.location;

        const nodeUrlObj = new URL(existingLocation.origin + node.nodeData.link);
        const existingUrlObj = new URL(existingLocation.href);

        // check node data click happens on same page
        if (
          nodeUrlObj.searchParams.get('id') === existingUrlObj.searchParams.get('id') &&
          nodeUrlObj.searchParams.get('root_parent_id') ===
            existingUrlObj.searchParams.get('root_parent_id')
        ) {
          return;
        }

        router.navigate(node.nodeData.link).then(e => {
          revalidateTreeSelectionStatus();
        });
      }
    },
    [revalidateTreeSelectionStatus]
  );

  const toggleNode = useCallback(async (id: number, value: boolean) => {
    const node = sharedStore.search(id);

    if (value === true) {
      if (node && !node.childNodes?.length) {
        node.hasCaret = false;
        node.disabled = true;
        node.secondaryLabel = <Spinner size={20} intent={Intent.PRIMARY} />;
        setRender(prevRender => !prevRender);

        const startTime = new Date(); // Start time
        const { data, error } = await fileStructureApiService.getContent({ parentId: id });

        if (error) {
          throw new Error('Something went wrong');
        }

        // Calculate time taken
        const endTime = new Date();

        if (data) {
          for (const item of data) {
            node.children?.push(item);
            node.childNodes = node.children;
          }
        }

        // this is necessary because if axios took less than 200ms animation seems weird
        if (endTime.getTime() - startTime.getTime() < 200) {
          // add another 200 ms waiting
          await sleep(200);
        }

        node.hasCaret = true;
        node.secondaryLabel = undefined;
        node.disabled = false;
      }

      node?.setIsExpanded(true);
    } else {
      node?.setIsExpanded(false);
    }

    setRender(prevRender => !prevRender);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeCollapse = useCallback(
    (node: RootFileStructure, _nodePath: NodePath) => toggleNode(node.id, false),
    [toggleNode]
  );

  const handleNodeExpand = useCallback(
    (node: RootFileStructure, _nodePath: NodePath) => toggleNode(node.id, true),
    [toggleNode]
  );

  return (
    <>
      <Tree
        className="gorilla-sidebar-tree-nodes p-1.5"
        contents={sharedStore.activeRootFileStructure}
        onNodeClick={handleNodeClick as TreeProps['onNodeClick']}
        onNodeCollapse={handleNodeCollapse as unknown as TreeProps['onNodeCollapse']}
        onNodeExpand={handleNodeExpand as unknown as TreeProps['onNodeExpand']}
      />
    </>
  );
});

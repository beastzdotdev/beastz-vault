import { Intent, Spinner, Tree, TreeProps } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { SharedStore } from '../features/shared/state/shared.store';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileStructureApiService, RootFileStructure } from '../shared';
import { getFileStructureUrlParams } from '../features/shared/helper/get-url-params';
import { observer } from 'mobx-react-lite';

type NodePath = number[];

export const SidebarTree = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const sharedStore = useInjection(SharedStore);
  const fileStructureApiService = useInjection(FileStructureApiService);
  const [render, setRender] = useState(true);

  const revalidateTreeSelectionStatus = useCallback(() => {
    console.log('='.repeat(20));
    console.log('revalidateTreeSelectionStatus');
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

    setRender(!render);
  }, [location.pathname, render, sharedStore]);

  // listen to route changes
  useEffect(() => {
    revalidateTreeSelectionStatus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleNodeClick = useCallback(
    (node: RootFileStructure, _nodePath: NodePath, _e: React.MouseEvent<HTMLElement>) => {
      console.log('='.repeat(20));
      console.log('handleNodeClick');
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

        navigate(node.nodeData.link);
      }
    },
    [navigate]
  );

  const toggleNode = useCallback(async (id: number, value: boolean) => {
    console.log('='.repeat(20));
    console.log('toggleNode');

    const node = sharedStore.search(id);

    if (value === true) {
      if (node && !node.childNodes?.length) {
        node.disabled = true;
        node.secondaryLabel = <Spinner size={20} intent={Intent.PRIMARY} />;
        setRender(prevRender => !prevRender);

        // fetch data
        console.log('='.repeat(20));
        console.log('started');

        const startTime = new Date(); // Start time
        const { data, error } = await fileStructureApiService.getContent(id);
        // Calculate time taken
        const endTime = new Date();

        if (data) {
          for (const item of data) {
            node.children?.push(item);
            node.childNodes = node.children;
          }
        }

        // this is necessary because if axios took less than 1 second junk animation happens
        if (endTime.getTime() - startTime.getTime() < 1000) {
          // wait for 1 second
          await new Promise(f => setTimeout(f, 1000));
        }

        node.secondaryLabel = undefined;
        node.disabled = false;
      }

      node?.setIsExpanded(true);
    } else {
      node?.setIsExpanded(false);
    }

    console.log('done');
    setRender(prevRender => !prevRender);
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

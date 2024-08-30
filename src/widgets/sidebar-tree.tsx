import { useInjection } from 'inversify-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { MobxTree } from '@pulexui/core';
import { useCallback, useState } from 'react';
import { Icon, Intent, Spinner, showContextMenu } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { SharedStore } from '../features/shared/state/shared.store';
import { RootFileStructure } from '../shared/model';
import { sleep } from '../shared/helper';
import { FileStructureApiService } from '../shared/api';
import { FileStuructureContextMenu } from './file-structure-item.widget';
import { toast } from '../shared/ui';
import { ChangeColor } from '../features/file-structure/widgets/change-color';
import { FileStructureDetails } from '../features/file-structure/widgets/file-structure-details';
import { FileStructureEncrypt } from '../features/file-structure/widgets/file-structure-encrypt/file-structure-encrypt';
import { bus } from '../shared/bus';

export const SidebarTree = observer(({ className }: { className?: string }) => {
  const sharedStore = useInjection(SharedStore);
  const fileStructureApiService = useInjection(FileStructureApiService);
  const navigate = useNavigate();

  //TODO: duplication resolve !!!
  // someasijaosid
  const [isChangeColorOpen, setChangeColorOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isFileStructureEncryptOpen, setFileStructureEncryptOpen] = useState(false);

  const x = [1, 2, true];

  //TODO duplication resolve !!!
  const store = useLocalObservable(() => ({
    selectedNode: null as RootFileStructure | null,

    setSelectedNode(node: RootFileStructure | null) {
      this.selectedNode = node;
    },

    clear() {
      this.selectedNode = null;
    },
  }));

  //TODO duplication resolve !!!
  const toggleOpen = useCallback(
    (value: boolean, type: 'change-color' | 'details' | 'encrypt') => {
      const finalValue = value;

      // is closing
      if (!finalValue) {
        store.clear();
      }

      switch (type) {
        case 'change-color':
          setChangeColorOpen(finalValue);
          break;
        case 'details':
          setDetailsOpen(finalValue);
          break;
        case 'encrypt':
          setFileStructureEncryptOpen(finalValue);
          break;
      }
    },
    [store]
  );

  const selectNode = useCallback(
    (node: RootFileStructure) => {
      store.setSelectedNode(node);

      // 1. It is better to select node first for animation speed
      node.setIsSelected(true);

      // 2. And then recusrively deselect others except the selected node
      sharedStore.recusive(sharedStore.activeRootFileStructure, n => {
        if (n.id !== node.id) {
          n.setIsSelected(false);
        }
      });
    },
    [sharedStore, store]
  );

  const handleNodeClick = useCallback(
    async (node: RootFileStructure) => {
      if (node.isFile) {
        bus.emit('show-file', { item: node, isInBin: false });
        return;
      }

      selectNode(node);

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

        navigate(node.link);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleNodeToggle = useCallback(
    async (node: RootFileStructure, value: boolean) => {
      if (value && node && !node.children?.length) {
        node.setActiveIcon('spinner');
        node.setHasCaret(false);
        node.setDisabled(true);

        const startTime = new Date(); // Start time
        const { data, error } = await fileStructureApiService.getContent({ parentId: node.id });

        if (error || !data) {
          throw new Error('Something went wrong');
        }

        // Calculate time taken
        const endTime = new Date();

        if (data) {
          node.addChildren(data);
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

  //! This causes warning, blueprint library at fault
  const handleContextMenu = useCallback(
    async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, node: RootFileStructure) => {
      e.preventDefault();

      // select node first
      selectNode(node);

      //TODO duplication resolve !!!
      showContextMenu({
        content: (
          <FileStuructureContextMenu
            node={node}
            key={node.id}
            onColorChange={() => toggleOpen(true, 'change-color')}
            onDetails={() => toggleOpen(true, 'details')}
            onEncrypt={async () => toggleOpen(true, 'encrypt')}
            onMoveToBin={async node => {
              await fileStructureApiService.moveToBin(node.id);
              window.location.reload();
            }}
            onCopy={node => {
              navigator.clipboard.writeText(node.title + (node.fileExstensionRaw ?? ''));
              toast.showMessage('Copied to clipboard');
            }}
            onDownload={async node => {
              const { error } = await fileStructureApiService.downloadById(node.id);
              if (error) {
                toast.error(error?.message ?? 'Sorry, something went wrong');
                return;
              }
            }}
          />
        ),
        targetOffset: {
          left: e.clientX,
          top: e.clientY,
        },
      });
    },

    [fileStructureApiService, selectNode, toggleOpen]
  );

  return (
    <>
      <MobxTree<number, RootFileStructure>
        compact={false}
        nodes={sharedStore.activeRootFileStructure}
        nodeClassName="beastz-vault-sidebar-tree-node"
        className={className ?? ''}
        onToggle={({ node, value }) => handleNodeToggle(node, value)}
        onClick={({ node }) => handleNodeClick(node)}
        onContextMenu={({ node, e }) => handleContextMenu(e, node)}
        renderTypeIcon={node => {
          if (node.activeIcon === 'spinner') {
            return <Spinner size={20} intent={Intent.PRIMARY} color={node.color ?? undefined} />;
          }

          return <Icon icon={node.activeIcon} color={node.color ?? undefined} />;
        }}
      />

      {store.selectedNode !== null && (
        <>
          {isChangeColorOpen && (
            <ChangeColor
              selectedNodes={[store.selectedNode]}
              isOpen={isChangeColorOpen}
              toggleIsOpen={value => toggleOpen(value, 'change-color')}
            />
          )}

          {isDetailsOpen && (
            <FileStructureDetails
              selectedNodes={[store.selectedNode]}
              isOpen={isDetailsOpen}
              toggleIsOpen={value => toggleOpen(value, 'details')}
              isInBin={false}
            />
          )}

          {isFileStructureEncryptOpen && (
            <FileStructureEncrypt
              selectedNodes={[store.selectedNode]}
              isOpen={isFileStructureEncryptOpen}
              toggleIsOpen={value => toggleOpen(value, 'encrypt')}
            />
          )}
        </>
      )}
    </>
  );
});

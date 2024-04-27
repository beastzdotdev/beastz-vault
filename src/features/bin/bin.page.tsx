import { Button, H2, Intent, NonIdealState, NonIdealStateIconSize } from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useInjection } from 'inversify-react';
import { useNavigate } from 'react-router-dom';
import { BinStore } from './state/bin.store';
import { SafeRenderArray } from '../../components/safe-render-array';
import { FileStuructureFileItem } from '../../widgets/file-structure-item.widget';
import { RestoreFromBin } from './widgets/restore-from-bin';
import { DeleteForeverBin } from './widgets/delete-forever-bin';
import { toast } from '../../shared/ui';
import { FileStructureDetails } from '../file-structure/widgets/file-structure-details';
import { RootFileStructure } from '../../shared/model';
import { FileStructureFileView } from '../file-structure/widgets/file-structure-file-view';
import { Bin } from './model/bin.model';

// const typeItems: AdvancedSelectItem[] = [
//   { key: uuid(), text: 'Images' },
//   { key: uuid(), text: 'Pdfs' },
//   { key: uuid(), text: 'Videos' },
//   { key: uuid(), text: 'Audios' },
//   { key: uuid(), text: 'Shortcuts' },
//   { key: uuid(), text: 'Folders' },
//   { key: uuid(), text: 'Files' },
//   { key: uuid(), text: 'Archives (zip)' },
// ];

// const modifiedItems: AdvancedSelectItem[] = [
//   { key: uuid(), text: 'Today' },
//   { key: uuid(), text: 'Last 7 days' },
//   { key: uuid(), text: 'Last 30days' },
//   { key: uuid(), text: 'This year' },
//   { key: uuid(), text: 'Last year' },
//   { key: uuid(), text: 'Custom' },
// ];

export const BinPage = observer((): React.JSX.Element => {
  const navigate = useNavigate();
  const binStore = useInjection(BinStore);
  // const [selectedType, setSelectedType] = useState<AdvancedSelectItem | null>(null);
  // const [modifiedType, setModifiedType] = useState<AdvancedSelectItem | null>(null);
  const [isDeleteForeverOpen, setDeleteForeverOpen] = useState(false);
  const [isFileViewOpen, setFileViewOpen] = useState(false);
  const [isRestoreOpen, setRestoreOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  const localSelectedStore = useLocalObservable(() => ({
    selectedNodes: new Set<Bin>(),

    setSelectedSingle(node: Bin) {
      if (this.selectedNodes.size === 1 && this.selectedNodes.has(node)) {
        return;
      }

      this.selectedNodes.clear();
      this.selectedNodes.add(node);
    },

    clear() {
      this.selectedNodes.clear();
    },

    get binNodePath() {
      return [...this.selectedNodes]?.[0]?.path;
    },

    get nodes(): RootFileStructure[] {
      return [...this.selectedNodes].map(e => e.fileStructure);
    },
  }));

  const toggleOpen = (
    value: boolean,
    type: 'restore' | 'delete-forever' | 'details' | 'file-view'
  ) => {
    const finalValue = value;

    // is closing
    if (!finalValue) {
      localSelectedStore.clear();
    }

    switch (type) {
      case 'restore':
        setRestoreOpen(finalValue);
        break;
      case 'delete-forever':
        setDeleteForeverOpen(finalValue);
        break;
      case 'details':
        setDetailsOpen(finalValue);
        break;
      case 'file-view':
        setFileViewOpen(finalValue);
        break;
    }
  };

  return (
    <div className="px-2.5 pt-3 cursor-default">
      <H2 className="font-extralight">Bin</H2>

      {/* <div className="w-full flex mt-5">
        <AdvancedSelect
          buttonProps={{ outlined: true }}
          className="min-w-[90px]"
          items={typeItems}
          value={selectedType}
          placeholder="Type"
          handleSelect={value => setSelectedType(value)}
        />
        <AdvancedSelect
          buttonProps={{ outlined: true }}
          className="ml-3 min-w-[120px]"
          items={modifiedItems}
          value={modifiedType}
          placeholder="Modified"
          handleSelect={value => setModifiedType(value)}
        />
      </div> */}

      <div className="gorilla-file-structure mt-5">
        <SafeRenderArray
          data={binStore.data}
          renderChild={binNode => {
            return (
              <FileStuructureFileItem
                isSelected={localSelectedStore.selectedNodes.has(binNode)}
                isFromBin
                key={binNode.id}
                node={binNode.fileStructure}
                onSelected={() => localSelectedStore.setSelectedSingle(binNode)}
                onRestore={() => toggleOpen(true, 'restore')}
                onDeleteForever={() => toggleOpen(true, 'delete-forever')}
                onDetails={() => toggleOpen(true, 'details')}
                onDoubleClick={async node => {
                  if (node.isFile) {
                    toggleOpen(true, 'file-view');
                  }
                }}
                onCopy={node => {
                  navigator.clipboard.writeText(node.title + (node.fileExstensionRaw ?? ''));
                  toast.showMessage('Copied to clipboard');
                }}
              />
            );
          }}
          renderError={() => {
            return (
              <NonIdealState
                className="mt-16"
                title="No folder found"
                icon="search"
                description="Looks like there were no folder or files found in this directory"
                action={
                  <Button onClick={() => navigate(-1)} intent={Intent.PRIMARY} minimal outlined>
                    Go back
                  </Button>
                }
                iconSize={NonIdealStateIconSize.STANDARD}
              />
            );
          }}
        />
      </div>

      {[...localSelectedStore.selectedNodes].length !== 0 && (
        <>
          {isRestoreOpen && (
            <RestoreFromBin
              selectedNodes={localSelectedStore.nodes}
              isOpen={isRestoreOpen}
              toggleIsOpen={value => toggleOpen(value, 'restore')}
            />
          )}

          {isDeleteForeverOpen && (
            <DeleteForeverBin
              selectedNodes={localSelectedStore.nodes}
              isOpen={isDeleteForeverOpen}
              toggleIsOpen={value => toggleOpen(value, 'delete-forever')}
            />
          )}

          {isDetailsOpen && (
            <FileStructureDetails
              selectedNodes={localSelectedStore.nodes}
              isOpen={isDetailsOpen}
              toggleIsOpen={value => toggleOpen(value, 'details')}
              isInBin={true}
            />
          )}

          {isFileViewOpen && (
            <FileStructureFileView
              selectedNode={localSelectedStore.nodes[0]}
              isOpen={isFileViewOpen}
              toggleIsOpen={value => toggleOpen(value, 'file-view')}
              isInBin={true}
              binFsPath={localSelectedStore.binNodePath}
            />
          )}
        </>
      )}
    </div>
  );
});

import { v4 as uuid } from 'uuid';
import { Button, H2, Intent, NonIdealState, NonIdealStateIconSize } from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useInjection } from 'inversify-react';
import { useNavigate } from 'react-router-dom';
import { AdvancedSelectItem, AdvancedSelect } from '../../components/advanced-select';
import { BinStore } from './state/bin.store';
import { SafeRenderArray } from '../../components/safe-render-array';
import { FileStuructureFileItem } from '../../widgets/file-structure-item.widget';
import { RestoreFromBin } from './widgets/restore-from-bin';
import { DeleteForeverBin } from './widgets/delete-forever-bin';
import { toast } from '../../shared/ui';

const typeItems: AdvancedSelectItem[] = [
  { key: uuid(), text: 'Images' },
  { key: uuid(), text: 'Pdfs' },
  { key: uuid(), text: 'Videos' },
  { key: uuid(), text: 'Audios' },
  { key: uuid(), text: 'Shortcuts' },
  { key: uuid(), text: 'Folders' },
  { key: uuid(), text: 'Files' },
  { key: uuid(), text: 'Archives (zip)' },
];

const modifiedItems: AdvancedSelectItem[] = [
  { key: uuid(), text: 'Today' },
  { key: uuid(), text: 'Last 7 days' },
  { key: uuid(), text: 'Last 30days' },
  { key: uuid(), text: 'This year' },
  { key: uuid(), text: 'Last year' },
  { key: uuid(), text: 'Custom' },
];

export const BinPage = observer((): React.JSX.Element => {
  const navigate = useNavigate();
  const binStore = useInjection(BinStore);
  const [selectedType, setSelectedType] = useState<AdvancedSelectItem | null>(null);
  const [modifiedType, setModifiedType] = useState<AdvancedSelectItem | null>(null);
  const [isRestoreOpen, setRestoreOpen] = useState(false);
  const [isDeleteForeverOpen, setDeleteForeverOpen] = useState(false);
  const localSelectedStore = useLocalObservable(() => ({
    selected: new Set<number>(),

    setSelectedSingle(id: number) {
      if (this.selected.size === 1 && this.selected.has(id)) {
        return;
      }

      this.selected.clear();
      this.selected.add(id);
    },

    clear() {
      this.selected.clear();
    },
  }));

  const toggleRestoreOpen = (value: boolean, type: 'restore' | 'delete-forever') => {
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
    }
  };

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <H2 className="font-extralight">Bin</H2>

      <div className="w-full flex mt-5">
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
      </div>

      <div className="gorilla-file-structure mt-5">
        <SafeRenderArray
          data={binStore.data}
          renderChild={binNode => {
            return (
              <FileStuructureFileItem
                isSelected={localSelectedStore.selected.has(binNode.fileStructure.id)}
                isFromBin
                key={binNode.id}
                node={binNode.fileStructure}
                onSelected={node => localSelectedStore.setSelectedSingle(node.id)}
                onRestore={() => setRestoreOpen(true)}
                onDeleteForever={() => setDeleteForeverOpen(true)}
                onDoubleClick={async node => {
                  if (node.isFile) {
                    //TODO show file
                    console.log(node);
                  }
                }}
                onCopy={node => {
                  navigator.clipboard.writeText(node.title);
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

      <RestoreFromBin
        isOpen={isRestoreOpen}
        selectedIds={[...localSelectedStore.selected]}
        toggleIsOpen={value => toggleRestoreOpen(value, 'restore')}
      />

      <DeleteForeverBin
        isOpen={isDeleteForeverOpen}
        selectedIds={[...localSelectedStore.selected]}
        toggleIsOpen={value => toggleRestoreOpen(value, 'delete-forever')}
      />
    </div>
  );
});

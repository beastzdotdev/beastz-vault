import { v4 as uuid } from 'uuid';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  H1,
  H2,
  Icon,
  Intent,
  NonIdealState,
  NonIdealStateIconSize,
} from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useInjection } from 'inversify-react';
import { useNavigate } from 'react-router-dom';
import { AdvancedSelectItem, AdvancedSelect } from '../../components/advanced-select';
import { BinStore } from './state/bin.store';
import { SafeRenderArray } from '../../components/safe-render-array';
import { FileStuructureFileItem } from '../../widgets/file-structure-item.widget';
import { SimpleFileStructureTree } from '../../widgets/simple-file-structure-tree';

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
  const [selectedType, setSelectedType] = useState<AdvancedSelectItem | null>(null);
  const [modifiedType, setModifiedType] = useState<AdvancedSelectItem | null>(null);
  const binStore = useInjection(BinStore);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const localSelectedStore = useLocalObservable(() => ({
    selected: new Set<number>(),

    setSelectedSingle(id: number) {
      if (this.selected.size === 1 && this.selected.has(id)) {
        return;
      }

      this.selected.clear();
      this.selected.add(id);
    },
    setSelectedMultiple(id: number) {
      if (this.selected.has(id)) {
        this.selected.delete(id);
      } else {
        this.selected.add(id);
      }
    },
    clear() {
      this.selected.clear();
    },
  }));

  const onClickinngSaveButton = () => {
    setIsOpen(!isOpen);
  };

  console.log('rerender');

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <H1 className="font-extralight">
        Bin page under construction <Icon intent="warning" size={40} icon="build"></Icon>
      </H1>
      <hr />

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
                onSelected={node => {
                  localSelectedStore.setSelectedSingle(node.id);
                }}
                onDoubleClick={async node => {
                  if (node.isFile) {
                    //TODO show file
                    console.log(node);
                  }
                }}
                onRestore={node => {
                  console.log('Restore', node);

                  setIsOpen(true);

                  // binStore.restore(node);
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

      <Dialog
        isOpen={isOpen}
        title="Create folder"
        onClose={() => setIsOpen(!isOpen)}
        isCloseButtonShown
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
      >
        <div
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onClickinngSaveButton();
            }
          }}
        >
          <DialogBody>
            <h1>hello</h1>

            <SimpleFileStructureTree />
          </DialogBody>

          <DialogFooter
            minimal
            actions={
              <>
                <Button onClick={() => setIsOpen(false)}>Close</Button>
                <Button intent={Intent.PRIMARY} onClick={() => onClickinngSaveButton()}>
                  Save
                </Button>
              </>
            }
          />
        </div>
      </Dialog>
    </div>
  );
});

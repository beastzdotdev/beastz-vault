import { v4 as uuid } from 'uuid';
import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  H2,
  Intent,
  NonIdealState,
  NonIdealStateIconSize,
} from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useInjection } from 'inversify-react';
import { useNavigate } from 'react-router-dom';
import { toJS } from 'mobx';
import { AdvancedSelectItem, AdvancedSelect } from '../../components/advanced-select';
import { BinStore } from './state/bin.store';
import { SafeRenderArray } from '../../components/safe-render-array';
import { FileStuructureFileItem } from '../../widgets/file-structure-item.widget';
import { SimpleFileStructureTree } from '../../widgets/simple-file-structure-tree';
import { FileStructureApiService } from '../../shared/api';
import { ExceptionMessageCode } from '../../shared/enum';
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
  const [selectedType, setSelectedType] = useState<AdvancedSelectItem | null>(null);
  const [modifiedType, setModifiedType] = useState<AdvancedSelectItem | null>(null);
  const binStore = useInjection(BinStore);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const fileStructureApiService = useInjection(FileStructureApiService);

  //TODO remove and also move delete forever into separate component
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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

  //TODO move restore location and all of it in separate compoent
  const localSelectedLocation = useLocalObservable(() => ({
    selectedId: null as number | null,

    setSelectedSingle(id: number | null) {
      this.selectedId = id;
    },

    clear() {
      this.selectedId = null;
    },
  }));

  //TODO delete forever
  const localForeverDelStore = useLocalObservable(() => ({
    isOpen: false,
    isLoading: false,

    setIsOpen(value: boolean) {
      this.isOpen = value;
    },

    setLoading(value: boolean) {
      this.isLoading = value;
    },

    clear() {
      this.isOpen = false;
      this.isLoading = false;
    },
  }));

  const toggleIsOpen = (value?: boolean) => {
    const finalValue = value ?? !isOpen;

    if (!finalValue) {
      // is closing
      localSelectedStore.clear();
      localSelectedLocation.clear();
    } else {
      // is opening
      localSelectedLocation.clear();
    }

    setIsOpen(finalValue);
  };

  const onClickingRestoreSaveButton = async () => {
    const selectedFsId = [...localSelectedStore.selected][0];

    const { data, error } = await fileStructureApiService.restoreFromBin(selectedFsId, {
      newParentId: localSelectedLocation.selectedId,
    });

    if (error?.message === ExceptionMessageCode.FS_SAME_NAME) {
      toast.error('File/Folder with same name exists already');
      toggleIsOpen(false); // will cause rerender for bin
      return;
    }

    if (error || !data) {
      throw new Error('Sorry, something went wrong');
    }

    window.location.reload(); //TODO here we should not refresh, we should refresh state
  };

  const onClickingForeverDeleteButton = async () => {
    //TODO delete forever
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
                onSelected={node => {
                  localSelectedStore.setSelectedSingle(node.id);
                }}
                onRestore={node => {
                  localSelectedStore.setSelectedSingle(node.id);
                  toggleIsOpen(true);
                }}
                onDeleteForever={node => {
                  console.log(toJS(node));

                  setIsAlertOpen(true);
                }}
                onDoubleClick={async node => {
                  if (node.isFile) {
                    //TODO show file
                    console.log(node);
                  }
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
        title="Choose Location"
        onClose={() => toggleIsOpen()}
        isCloseButtonShown
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
      >
        <div
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onClickingRestoreSaveButton();
            }
          }}
        >
          <DialogBody>
            <div style={{ maxHeight: 400 }}>
              <SimpleFileStructureTree
                onSelect={node => localSelectedLocation.setSelectedSingle(node?.id ?? null)}
              />
            </div>
          </DialogBody>

          <DialogFooter
            minimal
            actions={
              <>
                <Button onClick={() => toggleIsOpen(false)}>Close</Button>
                <Button intent={Intent.PRIMARY} onClick={() => onClickingRestoreSaveButton()}>
                  Save
                </Button>
              </>
            }
          />
        </div>
      </Dialog>

      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Confirm"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={isAlertOpen}
        loading={false}
        onCancel={() => setIsAlertOpen(false)}
      >
        <p>Are you sure you want to forever delete ? You won't be able to restore it</p>
      </Alert>
    </div>
  );
});

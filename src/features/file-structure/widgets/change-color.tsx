import { Dialog, DialogBody, DialogFooter, Button, Intent } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { FileStructureApiService } from '../../../shared/api';
import { ExceptionMessageCode } from '../../../shared/enum';
import { toast } from '../../../shared/ui';
import { getColorByBgColor, sleep } from '../../../shared/helper';
import { ClientApiError } from '../../../shared/errors';
import { SharedStore } from '../../shared/state/shared.store';
import { RootFileStructure } from '../../../shared/model';

type Params = {
  selectedNodes: RootFileStructure[];
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
};

const staticColors = [
  { name: 'Chocolate Ice Cream', hex: '#AC725F' },
  { name: 'Old Brick Red', hex: '#D06C67' },
  { name: 'Cardinal', hex: '#F73A1F' },
  { name: 'Wild Strawberries', hex: '#FB573C' },
  { name: 'Mars Orange', hex: '#FF7635' },
  { name: 'Yellow Cab', hex: '#FFAE47' },
  { name: 'Desert Sand', hex: '#F9EA82' },
  { name: 'Macaroni', hex: '#FBD265' },

  { name: 'Rainy Sky', hex: '#4987E9' },
  { name: 'Denim', hex: '#9FC7E7' },
  { name: 'Pool', hex: '#9EE2E7' },
  { name: 'Sea Foam', hex: '#92E2C0' },
  { name: 'Spearmint', hex: '#3FD792' },
  { name: 'Vern Fern', hex: '#14A868' },
  { name: 'Asparagus', hex: '#79D14A' },
  { name: 'Slime Green', hex: '#B4DD6D' },

  { name: 'Mouse', hex: '#5F6268' },
  { name: 'Mountain Grey', hex: '#CCBEC0' },
  { name: 'Earthworm', hex: '#CCA6AE' },
  { name: 'Bubblegum', hex: '#F691B3' },
  { name: 'Purple Rain', hex: '#D074E7' },
  { name: 'Toy Eggplant', hex: '#A47AE3' },
  { name: 'Blue Velvet', hex: '#999CFD' },
  { name: 'Purple Dino', hex: '#BA99FF' },
];

export const ChangeColor = observer(({ selectedNodes, isOpen, toggleIsOpen }: Params) => {
  const sharedStore = useInjection(SharedStore);
  const fileStructureApiService = useInjection(FileStructureApiService);

  const store = useLocalObservable(() => ({
    activeColor: null as string | null,
    timer: null as number | null,
    loading: false,

    setActiveColor(color: string | null) {
      this.activeColor = color;
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    clear() {
      this.activeColor = null;
      this.timer = null;
      this.loading = false;
    },
  }));

  const onError = (error?: ClientApiError) => {
    if (error?.message === ExceptionMessageCode.FS_SAME_NAME) {
      toast.error('File/Folder with same name exists already');
    } else {
      toast.error(error?.message || 'Sorry, something went wrong');
    }

    store.clear();
    toggleIsOpen(false); // will cause rerender for bin
  };

  const onSave = async () => {
    if (!store.activeColor) {
      return;
    }

    const selectedFsId = selectedNodes[0].id; //TODO in fututre multiple ids

    store.setLoading(true);

    const startTime = new Date(); // Start time
    const { data, error } = await fileStructureApiService.updateById(selectedFsId, {
      color: store.activeColor,
    });
    const endTime = new Date(); // Calculate time taken

    // this is necessary because if axios took less than 200ms animation seems weird
    if (endTime.getTime() - startTime.getTime() < 200) {
      // add another 400 ms waiting
      await sleep(400);
    }

    if (error || !data) {
      onError(error);
      return;
    }

    window.location.reload(); //TODO here we should not refresh, we should refresh state
  };

  useEffect(() => {
    if (!isOpen) {
      store.clear();
    }
  }, [isOpen, store]);

  useEffect(() => {
    store.setActiveColor(
      sharedStore.activeBodyFileStructure.find(e => e.id === selectedNodes[0]?.id)?.color ?? null
    );
  }, [selectedNodes, sharedStore.activeBodyFileStructure, store]);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title="Change color"
        onClose={() => toggleIsOpen(false)}
        className="w-fit"
        isCloseButtonShown
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
      >
        <div
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSave();
            }
          }}
        >
          <DialogBody>
            <div style={{ maxHeight: 400 }}>
              <HexColorPicker
                style={{ width: '100%' }}
                color={store.activeColor ?? undefined}
                onChange={color => store.setActiveColor(color)}
              />

              <div className="grid grid-cols-8 gap-1.5 mt-4">
                {staticColors.map(color => (
                  <Button
                    key={color.hex}
                    className={`rounded-full hover:border-white hover:border-solid hover:scale-125 transition-transform transform active:scale-100 active:duration-75 ${
                      store.activeColor === color.hex ? 'active-color' : ''
                    }`}
                    style={{ backgroundColor: color.hex, filter: 'saturate(130%)' }}
                    onClick={() => store.setActiveColor(color.hex)}
                  />
                ))}
              </div>
            </div>
          </DialogBody>

          <DialogFooter
            minimal
            actions={
              <>
                <Button
                  className="border-[0.5px] border-solid border-white border-opacity-35 w-36 hover:scale-105 transition-transform transform active:scale-100 active:duration-75"
                  onClick={() => {
                    navigator.clipboard.writeText(store.activeColor ?? '');
                    toast.showMessage('Copied to clipboard');
                  }}
                  style={{
                    backgroundColor: store.activeColor ?? undefined,
                    filter: 'saturate(130%)',
                    color: getColorByBgColor(store.activeColor) ?? undefined,
                  }}
                >
                  Active: {store.activeColor ?? 'none'}
                </Button>
                <Button onClick={() => toggleIsOpen(false)}>Close</Button>
                <Button intent={Intent.PRIMARY} onClick={() => onSave()} disabled={store.loading}>
                  Save
                </Button>
              </>
            }
          />
        </div>
      </Dialog>
    </>
  );
});

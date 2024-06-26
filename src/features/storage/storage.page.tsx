import { Button, H2, ProgressBar, Tooltip } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { computed } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { constants } from '../../shared/constants';
import { formatSizeRaw, formatSize, cleanURL, sleep } from '../../shared/helper';
import { SharedStore } from '../shared/state/shared.store';

import './storage.scss';
import { FileStructureApiService } from '../../shared/api';
import { toast } from '../../shared/ui';
import { PopConfirmCustom } from '../../components/pop-confirm-custom';

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

export const StoragePage = observer((): React.JSX.Element => {
  // const [selectedType, setSelectedType] = useState<AdvancedSelectItem | null>(null);
  // const [modifiedType, setModifiedType] = useState<AdvancedSelectItem | null>(null);

  const store = useLocalObservable(() => ({
    loading: false,

    setLoading(value: boolean) {
      this.loading = value;
    },

    clear() {
      this.loading = false;
    },
  }));

  const sharedStore = useInjection(SharedStore);
  const fileStructureApiService = useInjection(FileStructureApiService);
  const progressBarValue = computed(() => {
    const value =
      formatSizeRaw(sharedStore.generalInfo.totalSize) / constants.MAX_ALLOWED_FILE_SIZE_BYTES;

    if (value < 0.05 && value > 0) {
      return 0.025;
    }

    return value;
  });

  const cleanUp = async () => {
    store.setLoading(true);

    const startTime = new Date(); // Start time
    const { error } = await fileStructureApiService.cleanUpSpace();
    const endTime = new Date(); // Calculate time taken

    // this is necessary because if axios took less than 200ms animation seems weird
    if (endTime.getTime() - startTime.getTime() < 200) {
      // add another 400 ms waiting
      await sleep(400);
    }

    if (error) {
      toast.error(error?.message || 'Sorry, something went wrong');
      store.clear();
      return;
    }

    // hard redirect to file structure
    store.clear();
    window.location.href = cleanURL(constants.path.fileStructure).toString();
  };

  return (
    <div className="px-2.5 pt-3 cursor-default">
      <H2 className="font-extralight">Storage</H2>
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
      <div className="w-full mt-8">
        <p className="text-xs mt-1.5">
          <span className="text-3xl font-light">
            {formatSize(sharedStore.generalInfo.totalSize)}
          </span>
          <span className="text-sm opacity-50">
            {' '}
            of {constants.MAX_ALLOWED_TOTAL_SIZE_IN_GB} Gb
          </span>
        </p>
      </div>
      <div className="w-full mt-2">
        <ProgressBar
          value={progressBarValue.get()}
          animate={false}
          stripes={false}
          intent={'warning'}
          className="h-3 beastz-vault-page-storage-indicator"
        />
      </div>
      <div className="w-full mt-3 flex">
        <Tooltip
          popoverClassName="beastz-vault-popover-override"
          usePortal
          placement="bottom-start"
          intent="none"
          canEscapeKeyClose={false}
          hoverOpenDelay={75}
          hoverCloseDelay={200}
          fill
          content={<span>Occupied space: {formatSize(sharedStore.generalInfo.totalSize)}</span>}
        >
          <div className="flex items-center hover:opacity-50 delay-75 transition-all">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <p className="ml-1.5 text-xs opacity-80 font-light">Vault</p>
          </div>
        </Tooltip>

        <Tooltip
          disabled // TODO this is upcoming feature
          popoverClassName="beastz-vault-popover-override"
          usePortal
          placement="bottom-start"
          intent="none"
          canEscapeKeyClose={false}
          hoverOpenDelay={75}
          hoverCloseDelay={200}
          fill
          content={<span>Occupied space: 10000000 mb</span>}
        >
          <div className="flex items-center hover:opacity-50 delay-75 transition-all ml-4">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="ml-1.5 text-xs opacity-80 font-light">Doc (coming soon)</p>
          </div>
        </Tooltip>
      </div>
      <div className="w-full mt-5">
        <Button outlined intent="success" disabled>
          Get more storage (soon)
        </Button>

        <PopConfirmCustom
          title="Clean up space"
          text="Are you sure you want to clean up space? (this action cannot be undone)"
          onSuccessClick={cleanUp}
        >
          <Button className="ml-3" intent="danger" loading={store.loading}>
            Clean up space
          </Button>
        </PopConfirmCustom>
      </div>{' '}
    </div>
  );
});

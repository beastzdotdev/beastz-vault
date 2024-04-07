import { v4 as uuid } from 'uuid';
import { Button, H2, Popover, ProgressBar, Tooltip } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { constants } from '../../shared/constants';
import { formatSizeRaw, formatSize } from '../../shared/helper';
import { SharedStore } from '../shared/state/shared.store';
import { AdvancedSelectItem, AdvancedSelect } from '../../components/advanced-select';

import './storage.scss';

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

export const StoragePage = observer((): React.JSX.Element => {
  const [selectedType, setSelectedType] = useState<AdvancedSelectItem | null>(null);
  const [modifiedType, setModifiedType] = useState<AdvancedSelectItem | null>(null);
  console.log('rerender');

  const sharedStore = useInjection(SharedStore);
  const progressBarValue = computed(() => {
    return formatSizeRaw(sharedStore.generalInfo.totalSize) / constants.MAX_ALLOWED_FILE_SIZE_BYTES;
  });

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <H2 className="font-extralight">Storage</H2>

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
          value={progressBarValue.get() < 0.05 ? 0.025 : progressBarValue.get()}
          animate={false}
          stripes={false}
          intent={'warning'}
          className="h-3 gorilla-page-storage-indicator"
        />
      </div>

      <div className="w-full mt-3 flex">
        <Tooltip
          popoverClassName="gorilla-popover-override"
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
            <p className="ml-1.5 text-xs opacity-80 font-light">Gorilla vault</p>
          </div>
        </Tooltip>

        <Tooltip
          popoverClassName="gorilla-popover-override"
          usePortal
          placement="bottom-start"
          intent="none"
          canEscapeKeyClose={false}
          hoverOpenDelay={75}
          hoverCloseDelay={200}
          fill
          // TODO this is upcoming feature
          disabled
          content={<span>Occupied space: 10000000 mb</span>}
        >
          <div className="flex items-center hover:opacity-50 delay-75 transition-all ml-4">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <p className="ml-1.5 text-xs opacity-80 font-light">Gorilla doc (coming soon)</p>
          </div>
        </Tooltip>
      </div>

      <div className="w-full mt-5">
        <Button outlined intent="primary">
          Get more storage
        </Button>

        <Button className="ml-3" intent="warning">
          Clean up space
        </Button>
      </div>

      <div className="mt-10">
        {/* TODO finish this page */}
        <h1>Page will be finished soon !!!</h1>
      </div>
    </div>
  );
});

import { v4 as uuid } from 'uuid';
import { H2 } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useInjection } from 'inversify-react';
import { AdvancedSelectItem, AdvancedSelect } from '../../components/advanced-select';
import { BinStore } from './state/bin.store';

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

  console.log('rerender');

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

      {/* TODO bin needs finish resume here */}
      <div className="w-full mt-5">
        {binStore.data.map(e => (
          <div key={e.id}>{e.name}</div>
        ))}
      </div>
    </div>
  );
});

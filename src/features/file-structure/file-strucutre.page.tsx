import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import { Breadcrumbs } from '@blueprintjs/core';
import { FileStructureTopBar } from './widgets/file-structure-topbar';
import { AdvancedSelect, AdvancedSelectItem } from '../../components/advanced-select';
import { useDebounceHook } from '../../hooks/use-debounce.hook';
import { FileStructureFilesWidget } from './widgets/file-structure-files.widget';

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

const peopleItems: AdvancedSelectItem[] = [
  { key: uuid(), text: 'pish' },
  { key: uuid(), text: 'breakthroughstallion' },
  { key: uuid(), text: 'mysteriously' },
  { key: uuid(), text: 'architecture' },
  { key: uuid(), text: 'pishaquarium' },
  { key: uuid(), text: 'besidesamong' },
];

export const FileStructurePage = (): React.JSX.Element => {
  const [selectedType, setSelectedType] = useState<AdvancedSelectItem | null>(null);
  const [modifiedType, setModifiedType] = useState<AdvancedSelectItem | null>(null);
  const [person, setPerson] = useState<AdvancedSelectItem | null>(null);

  const [_, setPersonTerm] = useDebounceHook({
    debounceTime: 500,
    onClear: () => {
      console.log('='.repeat(20));
      console.log('Cleared');
    },
    onDebounceSetValue: debouncedValue => {
      console.log('='.repeat(20));
      console.log(`Searching for: ${debouncedValue} (snapshot debounced value person term)`);
    },
  });

  return (
    <>
      <FileStructureTopBar />

      <div className="p-3 overflow-hidden">
        <div className="w-full">
          <Breadcrumbs
            className="max-w-sm"
            items={[
              { href: '#', icon: 'folder-close', text: 'All files' },
              { href: '#', icon: 'folder-close', text: 'Users' },
              { href: '#', icon: 'folder-close', text: 'Janet' },
              { href: '#', icon: 'folder-close', text: 'Photos' },
              { href: '#', icon: 'folder-close', text: 'Wednesday' },
              { icon: 'folder-close', text: 'Stuff' },
            ]}
          />
        </div>

        <div className="w-full flex pt-3">
          <AdvancedSelect
            className="min-w-[90px]"
            items={typeItems}
            value={selectedType}
            placeholder="Type"
            handleSelect={value => setSelectedType(value)}
          />

          <AdvancedSelect
            className="ml-3 min-w-[120px]"
            items={modifiedItems}
            value={modifiedType}
            placeholder="Modified"
            handleSelect={value => setModifiedType(value)}
          />

          <AdvancedSelect
            className="ml-3 min-w-[100px]"
            items={peopleItems}
            value={person}
            placeholder="Person"
            onFilter={value => setPersonTerm(value)}
            handleSelect={value => setPerson(value)}
            onSearch={_value => {
              console.log('='.repeat(20));
              console.log('Searched value');
            }}
          />
        </div>

        <div className="pt-3">
          <FileStructureFilesWidget />
        </div>
      </div>
    </>
  );
};

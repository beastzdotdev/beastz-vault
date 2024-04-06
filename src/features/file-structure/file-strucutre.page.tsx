import { v4 as uuid } from 'uuid';
import { useCallback, useState } from 'react';
import { BreadcrumbProps, Breadcrumbs } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { FileStructureTopBar } from './widgets/file-structure-topbar';
import { AdvancedSelect, AdvancedSelectItem } from '../../components/advanced-select';
import { useDebounceHook } from '../../hooks/use-debounce.hook';
import { FileStructureFilesWidget } from './widgets/file-structure-files.widget';
import { SharedStore } from '../shared/state/shared.store';
import { SharedController } from '../shared/state/shared.controller';
import { constants } from '../../shared/constants';

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

const RenderBreadcrumb = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);
  const sharedController = useInjection(SharedController);

  const onBreadCrumbClick = useCallback(
    (e: React.MouseEvent, link: string) => {
      console.log(e);
      console.log(link);

      e.preventDefault(); // do not refresh

      // Push to history
      sharedController.pushToHistory(link);
    },

    [sharedController]
  );

  if (sharedStore.activeId === 'root') {
    // do not add href because no need to redirect on root if already on root
    return <Breadcrumbs className="max-w-sm" items={[{ icon: 'cloud', text: 'cloud' }]} />;
  }

  return (
    <Breadcrumbs
      className="max-w-sm select-none"
      items={sharedStore
        .searchNodeAndParents(sharedStore.activeRootFileStructure, sharedStore.activeId)
        ?.filter(Boolean)
        .reduce<BreadcrumbProps[]>((acc, node, i, arr) => {
          console.log(node);

          const isLast = i === arr.length - 1;

          if (i === 0) {
            // This here represents root and here href is needed
            acc.push({
              icon: 'cloud',
              text: 'cloud',
              href: constants.path.fileStructure,
            });
          }

          // This here represents each node parent and node iteslf
          acc.push({
            onClick: e => onBreadCrumbClick(e, node.link!),
            icon: 'folder-close',
            text: node.name,
            ...(!isLast && { href: node.link }), // add href except for last (e.g. itself)
          });

          return acc;
        }, [])}
    />
  );
});

export const FileStructurePage = observer((): React.JSX.Element => {
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

      <div className="overflow-y-auto">
        <div className="p-3">
          <RenderBreadcrumb />

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
      </div>
    </>
  );
});

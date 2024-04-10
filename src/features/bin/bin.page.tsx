import { v4 as uuid } from 'uuid';
import {
  Button,
  H1,
  H2,
  H3,
  H4,
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
import { router } from '../../router';

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

      <div className="mt-5">
        {binStore.data.map(e => {
          return (
            <div className="flex">
              title: <H3 className="ml-5">{e.fileStructure.title}</H3>
              <p className="ml-5">{e.fileStructure.path}</p>
            </div>
          );
        })}
      </div>

      {/* <div className="gorilla-file-structure mt-5">
        <SafeRenderArray
          data={binStore.data}
          renderChild={node => {
            return (
              <FileStuructureFileItem
                isSelected={false}
                isFromBin
                key={node.id}
                node={node.fileStructure}
                onSelected={node => {
                  localSelectedStore.setSelectedSingle(node.id);
                }}
                onDoubleClick={async node => {
                  console.log(node);

                  if (!node.isFile) {
                    const url = new URL(window.location.href);
                    url.searchParams.set('id', node.id.toString());
                    console.log(url);

                    router.navigate(url.pathname + url.search);
                  } else {
                    //TODO show file
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
      </div> */}
    </div>
  );
});

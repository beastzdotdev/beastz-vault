import { InputGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '../../../hooks/use-debounce.hook';
import { RootFileStructure } from '../../../shared/model';
import { FileStructureApiService } from '../../../shared/api';
import { toast } from '../../../shared/ui';
import { bus } from '../../../shared/bus';

export const FileStructureSearchBar = observer((): React.JSX.Element => {
  const navigate = useNavigate();
  const fileStructureApiService = useInjection(FileStructureApiService);

  const store = useLocalObservable(() => ({
    items: [] as RootFileStructure[],

    setItem(value: RootFileStructure[]) {
      this.items = value;
    },

    clear() {
      this.items.length = 0;
    },
  }));

  const [value, setValue] = useState('');
  const debouncedSearchTerm = useDebouncedValue(value, 500);

  useEffect(
    () => {
      (async () => {
        if (value.trim() !== '') {
          const { data, error } = await fileStructureApiService.search({ search: value.trim() });
          if (!data || error) {
            toast.error('Sorry, something went wrong');
            return;
          }

          console.log(data);
          store.setItem(data);
        } else {
          store.clear();
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm]
  );

  const handleSelectOnItem = (
    item: RootFileStructure,
    _event?: React.SyntheticEvent<HTMLElement>
  ) => {
    if (item.isFile) {
      bus.emit('show-file', { fs: item });
    } else {
      navigate(item.link);
    }
    console.log('select', item);
    store.clear();
    setValue('');
  };

  return (
    <>
      <Select<RootFileStructure>
        fill
        popoverProps={{
          matchTargetWidth: true,
          minimal: true,
        }}
        filterable={false}
        items={store.items}
        className="w-fit max-w-[600px]"
        onItemSelect={handleSelectOnItem}
        noResults={<MenuItem disabled text="No results." roleStructure="menuitem" />}
        itemRenderer={(item, { handleClick, handleFocus, modifiers }) => (
          <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={item.id}
            onClick={handleClick} // buble up events
            onFocus={handleFocus} // buble up events
            roleStructure="menuitem"
            label={item?.fileExstensionRaw ?? ''}
            text={item.title}
          />
        )}
      >
        <InputGroup
          value={value ?? ''}
          onChange={e => setValue(e.target.value)}
          leftIcon="search"
          placeholder="Search content"
        />
      </Select>
    </>
  );
});

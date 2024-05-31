import { InputGroup, MenuItem, Tag } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '../../../hooks/use-debounce.hook';
import { RootFileStructure } from '../../../shared/model';
import { FileStructureApiService } from '../../../shared/api';
import { toast } from '../../../shared/ui';
import { bus } from '../../../shared/bus';

export const FileStructureSearchBar = observer((): React.JSX.Element => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const fileStructureApiService = useInjection(FileStructureApiService);
  const debouncedSearchTerm = useDebouncedValue(value, 500);

  const el = useRef<HTMLInputElement>(null);

  const store = useLocalObservable(() => ({
    items: [] as RootFileStructure[],

    setItem(value: RootFileStructure[]) {
      this.items = value;
    },

    clear() {
      this.items.length = 0;
    },
  }));

  useEffect(
    () => {
      (async () => {
        if (value.trim() !== '') {
          const { data, error } = await fileStructureApiService.search({ search: value.trim() });
          if (!data || error) {
            toast.error('Sorry, something went wrong');
            return;
          }

          // console.log(data);
          store.setItem(data);
        } else {
          store.clear();
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm]
  );

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === '/' && el.current) {
        el.current.click();
        el.current.focus();
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp); // Cleanup on unmount
    };
  }, [el]);

  const handleSelectOnItem = (
    item: RootFileStructure,
    _event?: React.SyntheticEvent<HTMLElement>
  ) => {
    if (item.isFile) {
      bus.emit('show-file', { item, isInBin: false });
    } else {
      navigate(item.link);
    }

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
            label={item.mimeTypeRaw ?? 'Folder'}
            text={item.title + (item?.fileExstensionRaw ?? '')}
          />
        )}
      >
        <InputGroup
          inputRef={el}
          value={value ?? ''}
          onChange={e => setValue(e.target.value)}
          leftIcon="search"
          placeholder="Search content"
          rightElement={
            <Tag className="text-center" minimal={true}>
              /
            </Tag>
          }
        />
      </Select>
    </>
  );
});

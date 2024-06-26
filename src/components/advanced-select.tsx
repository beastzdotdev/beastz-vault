import { useState } from 'react';
import { Button, ButtonProps, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

interface AdvancedSelectParams {
  items: AdvancedSelectItem[];

  className?: string;
  placeholder?: string;
  value?: AdvancedSelectItem | null;
  disabled?: boolean;
  buttonProps?: ButtonProps;
  handleSelect?: (value: AdvancedSelectItem) => void;
  onSearch?: (value: string) => void;
  onFilter?: (value: string) => void;
}

export interface AdvancedSelectItem {
  key: string;
  text: string;
  label?: string | null;
}

export const AdvancedSelect = ({
  items,
  placeholder,
  value,
  className,
  disabled,
  buttonProps,
  handleSelect,
  onSearch,
  onFilter,
}: AdvancedSelectParams): React.JSX.Element => {
  const [selectedItem, setSelectedItem] = useState<AdvancedSelectItem | null | undefined>(value);

  const handleSelectOnItem = (
    item: AdvancedSelectItem,
    _event?: React.SyntheticEvent<HTMLElement>
  ) => {
    setSelectedItem(item); // for inside event
    if (handleSelect) handleSelect(item); // for outside event
  };

  return (
    <>
      <Select<AdvancedSelectItem>
        disabled={disabled}
        className={`w-fit ${className ?? ''}`}
        items={items}
        onItemSelect={handleSelectOnItem}
        noResults={<MenuItem disabled text="No results." roleStructure="menuitem" />}
        filterable={onSearch !== undefined}
        onQueryChange={query => onFilter?.(query)}
        itemRenderer={(item, { handleClick, handleFocus, modifiers }) => (
          <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={item.key}
            onClick={handleClick} // buble up events
            onFocus={handleFocus} // buble up events
            roleStructure="menuitem"
            label={item?.label ?? ''}
            text={item.text}
          />
        )}
      >
        <Button
          {...buttonProps}
          fill
          text={selectedItem?.text ?? placeholder}
          rightIcon="caret-down"
        />
      </Select>
    </>
  );
};

import { Button, InputGroup } from '@blueprintjs/core';
import { useDebounceHook } from '../../../hooks/use-debounce.hook';

export const FileStructureTopBar = () => {
  const [searchTerm, setSearchTerm] = useDebounceHook({
    debounceTime: 500,
    onClear: () => {
      console.log('='.repeat(20));
      console.log('Cleared');
    },
    onDebounceSetValue: snapshotValue => {
      console.log('='.repeat(20));
      console.log(`Searching for: ${snapshotValue} (snapshot value)`);
      console.log(`Searching for: ${searchTerm}`);
    },
  });

  return (
    <>
      <div className="flex justify-between p-3">
        <InputGroup
          value={searchTerm ?? ''}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon="search"
          placeholder="Search content"
          className="min-w-[600px]"
        />

        <div>
          <Button minimal icon="notifications" intent="none" />
          <Button minimal icon="layers" intent="none" />
        </div>
      </div>
    </>
  );
};

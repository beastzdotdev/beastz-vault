import { Suspense, lazy } from 'react';
import { Button, InputGroup, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { useDebounceHook } from '../../../hooks/use-debounce.hook';

const DobermanLogo = lazy(() => import('../../../assets/svg/misc/doberman.svg?react'));
const ScarabLogo = lazy(() => import('../../../assets/svg/misc/scarab.svg?react'));

export const FileStructureTopBar = (): React.JSX.Element => {
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

        <div className="whitespace-nowrap">
          <Button minimal icon="notifications" intent="none" />

          <Popover
            content={
              <Menu>
                <MenuItem
                  text="Scarab doc (coming soon)"
                  icon={
                    <Suspense fallback={<div></div>}>
                      <ScarabLogo />
                    </Suspense>
                  }
                />
                <MenuItem
                  text="Dober helper (coming soon)"
                  icon={
                    <Suspense fallback={<div></div>}>
                      <DobermanLogo />
                    </Suspense>
                  }
                />
              </Menu>
            }
            placement="right-start"
          >
            <Button minimal icon="layers" intent="none" />
          </Popover>
        </div>
      </div>
    </>
  );
};

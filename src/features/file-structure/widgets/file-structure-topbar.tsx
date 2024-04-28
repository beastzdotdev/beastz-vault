import { Suspense, lazy } from 'react';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { FileStructureSearchBar } from './file-structure-search-bar';

const DobermanLogo = lazy(() => import('../../../assets/svg/misc/doberman.svg?react'));
const ScarabLogo = lazy(() => import('../../../assets/svg/misc/scarab.svg?react'));

export const FileStructureTopBar = (): React.JSX.Element => {
  return (
    <>
      <div className="flex justify-between p-3">
        <FileStructureSearchBar />

        <div className="whitespace-nowrap">
          {/* TODO: Notification */}
          {/* <Button minimal icon="notifications" intent="none" /> */}
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
            <Button minimal icon="layout-grid" intent="none" />
          </Popover>
        </div>
      </div>
    </>
  );
};

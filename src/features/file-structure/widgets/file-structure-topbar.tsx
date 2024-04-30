import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { FileStructureSearchBar } from './file-structure-search-bar';

export const FileStructureTopBar = (): React.JSX.Element => {
  return (
    <>
      <div className="flex justify-between p-3">
        <FileStructureSearchBar />

        <div className="whitespace-nowrap">
          {/* TODO: Better UI */}
          <Popover
            content={
              <Menu>
                <MenuItem text="Doc (soon)" icon="document" intent="success" />
                <MenuItem text="Util (soon)" icon="wrench" intent="primary" />
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

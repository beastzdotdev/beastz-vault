import { Popover, Menu } from '@blueprintjs/core';

type Params = {
  children: JSX.Element;
  menuChildren: JSX.Element;
};

export const MenuPopover = (params: Params) => {
  return (
    <Popover
      placement="bottom-start"
      transitionDuration={0}
      popoverClassName="!shadow-none pt-1.5"
      minimal
      content={
        <Menu small className="border border-gray-400 border-opacity-25">
          {params.menuChildren}
        </Menu>
      }
    >
      {params.children}
    </Popover>
  );
};

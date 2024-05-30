import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from './shared/state/shared.store';
import { Sidebar } from './shared/widgets/sidebar';

export const App = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);

  //TODO: file view and listenet shold be here before outlet
  //TODO: create separate component which returns nothing empty html

  return (
    <>
      {sharedStore.shouldRender && (
        <>
          <div className="flex h-full">
            <Sidebar />

            <div className="flex flex-col flex-1">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </>
  );
});

import { Outlet } from 'react-router-dom';
import { Sidebar } from './shared/ui/sidebar';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from './shared/state/shared.store';

export const App = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);

  return (
    <>
      {sharedStore.shouldRender && (
        <>
          <div className="flex">
            <Sidebar />

            <Outlet />
          </div>
        </>
      )}
    </>
  );
});

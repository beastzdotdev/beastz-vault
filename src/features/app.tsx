import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from './shared/state/shared.store';
import { Sidebar } from './shared/widgets/sidebar';

export const App = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);

  return (
    <>
      {sharedStore.shouldRender && (
        <>
          <div className="flex">
            <Sidebar />

            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </>
  );
});

import { Outlet } from 'react-router-dom';
import { Sidebar } from './shared/ui/sidebar';
import { TopBar } from './shared/ui/topbar';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from './shared/state/shared.store';

export const App = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);

  return (
    <>
      {sharedStore.shouldRender && (
        <>
          <TopBar />

          <div className="flex">
            <div className="w-[250px] bg-slate-900 h-screen">
              <Sidebar />
            </div>

            <div className="m-[100px]">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </>
  );
});

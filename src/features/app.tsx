import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { RootNavbar } from '../components/navbar';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from './shared/state/shared.store';

export const App = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);

  return (
    <>
      {sharedStore.shouldRender && (
        <>
          <RootNavbar />

          <div className="flex">
            <div className="w-[250px] bg-slate-600 h-svh">
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

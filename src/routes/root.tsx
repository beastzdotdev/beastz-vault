import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { RootNavbar } from '../components/navbar';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { AppStore } from '../features/app/state/app.store';

export const Root = observer((): React.JSX.Element => {
  const appStore = useInjection(AppStore);

  return (
    <>
      {appStore.shouldRender && (
        <>
          <RootNavbar />

          <div className="flex">
            <div className="w-[250px]">
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

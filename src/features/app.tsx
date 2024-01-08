import { Outlet, createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './shared/widgets/sidebar';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from './shared/state/shared.store';
import { useLayoutEffect } from 'react';
import { constants, getQueryParams } from '../shared';

export const App = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const queryParams = getQueryParams<{ id?: string }>(location.search);

    let navigateTimeout: ReturnType<typeof setTimeout> | undefined;

    // if root page or file structure
    if (
      (location.pathname === '/' || location.pathname === constants.path.fileStructure) &&
      !queryParams.id
    ) {
      navigateTimeout = setTimeout(() => {
        navigate({
          pathname: constants.path.fileStructure,
          search: createSearchParams({ id: 'root' }).toString(),
        });
      }, 0);
    }

    return () => {
      if (navigateTimeout) {
        clearTimeout(navigateTimeout);
      }
    };
  }, [location, navigate]);

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

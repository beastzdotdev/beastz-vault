import queryString from 'query-string';
import { Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useEffect } from 'react';
import { SharedStore } from './shared/state/shared.store';
import { Sidebar } from './shared/widgets/sidebar';
import { constants } from '../shared/constants';

export const App = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);
  const location = useLocation();

  useEffect(() => {
    // track file structure active id and rootParentId
    if (location.pathname.includes(constants.path.fileStructure)) {
      const { id, root_parent_id } = queryString.parse(location.search, {
        parseBooleans: true,
        parseNumbers: true,
      }) as { id: 'root' | number; root_parent_id?: number };

      sharedStore.setRouterParams(id, root_parent_id);
    }
  }, [location, sharedStore]);

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

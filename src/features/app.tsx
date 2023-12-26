import { Outlet } from 'react-router-dom';
import { Sidebar } from './shared/ui/sidebar';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from './shared/state/shared.store';
import { useCallback, useEffect, useRef, useState } from 'react';

export const App = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    mouseMoveEvent => {
      if (isResizing) {
        setSidebarWidth(
          mouseMoveEvent.clientX - (sidebarRef.current?.getBoundingClientRect()?.left ?? 0)
        );
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <>
      {sharedStore.shouldRender && (
        <>
          {/* <TopBar /> */}

          <div className="flex">
            <div
              className="gorilla-sidebar bg-zinc-900 h-screen relative transition-width duration-100 max-w-[600px] min-w-[250px]"
              ref={sidebarRef}
              style={{ width: sidebarWidth }}
              onMouseDown={e => e.preventDefault()}
            >
              <div className="resize-bar" onMouseDown={startResizing}>
                <div className="resize-line"></div>
              </div>
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

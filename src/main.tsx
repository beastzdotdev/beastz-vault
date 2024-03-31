import 'reflect-metadata';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { FocusStyleManager, HotkeysProvider, OverlaysProvider } from '@blueprintjs/core';

// styles
import './index.scss';
import './declares/declares.d.ts';
import './declares/declares.d.tsx';
import { Provider } from 'inversify-react';
import { configure } from 'mobx';
import { ioc, GlobalAlertProvider } from './shared';

// misc
FocusStyleManager.onlyShowFocusOnTabs();

configure({
  enforceActions: 'always',
  useProxies: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
});

//TODO remove searchbar and add omnibar

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider container={ioc.getContainer()}>
    <OverlaysProvider>
      <HotkeysProvider>
        <GlobalAlertProvider>
          <RouterProvider router={router} />
        </GlobalAlertProvider>
      </HotkeysProvider>
    </OverlaysProvider>
  </Provider>
);

// //! Disable this to check where mobx reads are fked
// if (import.meta.env.DEV) {
//   configure({
//     enforceActions: 'never',
//     useProxies: 'never',
//     computedRequiresReaction: false,
//     reactionRequiresObservable: false,
//   });

//   import('./devtools');
// }

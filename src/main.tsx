import 'reflect-metadata';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { FocusStyleManager, HotkeysProvider, OverlaysProvider } from '@blueprintjs/core';
import { Provider } from 'inversify-react';
import { configure } from 'mobx';
import { router } from './router';
import { ioc } from './shared/ioc/ioc.ts';
import { GlobalAlertProvider } from './shared/ui/index.ts';

// styles
import './index.scss';
import './declares/declares.d.ts';
import './declares/declares.d.tsx';

// misc
FocusStyleManager.onlyShowFocusOnTabs();

configure({
  enforceActions: 'observed',
  useProxies: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
});

createRoot(document.getElementById('root')!).render(
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

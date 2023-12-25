import 'reflect-metadata';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { FocusStyleManager, HotkeysProvider } from '@blueprintjs/core';

// styles
import './index.scss';
import { Provider } from 'inversify-react';
import { configure } from 'mobx';
import { ioc, GlobalAlertProvider } from './shared';

// misc
FocusStyleManager.onlyShowFocusOnTabs();

configure({
  enforceActions: 'always',
  useProxies: 'always',
  computedRequiresReaction: true,
  observableRequiresReaction: true,
  reactionRequiresObservable: true,
});

const rootNode = document.getElementById('root');
ReactDOM.render(
  <Provider container={ioc.getContainer()}>
    <HotkeysProvider>
      <GlobalAlertProvider>
        <RouterProvider router={router} />
      </GlobalAlertProvider>
    </HotkeysProvider>
  </Provider>,
  rootNode
);

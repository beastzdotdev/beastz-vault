import 'reflect-metadata';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { router } from './shared/router';
import { FocusStyleManager, HotkeysProvider } from '@blueprintjs/core';

// styles
import './index.scss';
import { GlobalAlertProvider } from './shared/global-alert';
import { Provider } from 'inversify-react';
import { configure } from 'mobx';
import { ioc } from './shared/ioc';

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

import 'reflect-metadata';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { FocusStyleManager, HotkeysProvider } from '@blueprintjs/core';

// styles
import './index.scss';
import { GlobalAlertProvider } from './global-alert';
import { Provider } from 'inversify-react';
import { IocContainer } from './shared/ioc';
import { configure } from 'mobx';

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
  <Provider container={IocContainer.getContainer()}>
    <HotkeysProvider>
      <GlobalAlertProvider>
        <RouterProvider router={router} />
      </GlobalAlertProvider>
    </HotkeysProvider>
  </Provider>,
  rootNode
);

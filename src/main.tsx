import 'reflect-metadata';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';
import { FocusStyleManager, HotkeysProvider } from '@blueprintjs/core';

// styles
import './index.scss';
import { GlobalAlertProvider } from './global-alert';
import { Provider } from 'inversify-react';
import { IocContainer } from './app/ioc';
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

//UI
// http://demo.casaos.io/#/

//TODO add listener to route change don let login while authorized
//TODO PKCE add in both backend and frontend https://developers.onelogin.com/blog/pkce-dust-react-app

const rootNode = document.getElementById('root');
ReactDOM.render(
  <Provider container={IocContainer.getContainer()}>
    <ReduxProvider store={store}>
      <HotkeysProvider>
        <GlobalAlertProvider>
          <RouterProvider router={router} />
        </GlobalAlertProvider>
      </HotkeysProvider>
    </ReduxProvider>
  </Provider>,
  rootNode
);

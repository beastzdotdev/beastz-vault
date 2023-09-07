import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { FocusStyleManager, HotkeysProvider } from '@blueprintjs/core';

// styles
import './index.scss';
import { GlobalAlertProvider } from './global-alert';

// misc
FocusStyleManager.onlyShowFocusOnTabs();

//TODO add listener to route change don let login while authorized
//TODO PKCE add in both backend and frontend https://developers.onelogin.com/blog/pkce-dust-react-app

const rootNode = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <HotkeysProvider>
      <GlobalAlertProvider>
        <RouterProvider router={router} />
      </GlobalAlertProvider>
    </HotkeysProvider>
  </Provider>,
  rootNode
);

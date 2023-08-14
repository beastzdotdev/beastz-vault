import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { FocusStyleManager, HotkeysProvider } from '@blueprintjs/core';

// styles
import './index.scss';

// misc
FocusStyleManager.onlyShowFocusOnTabs();

const rootNode = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <HotkeysProvider>
      <RouterProvider router={router} />
    </HotkeysProvider>
  </Provider>,
  rootNode
);

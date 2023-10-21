import { Alert, Intent } from '@blueprintjs/core';
import { createContext, useContext, useEffect, useState } from 'react';
import { bus } from './bus';

const GlobalAlert = ({
  isOpen,
  message,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  onClose: any;
}) => {
  return (
    <Alert
      isOpen={isOpen}
      onClose={onClose}
      intent={Intent.NONE}
      icon="issue"
      confirmButtonText="OK"
      canEscapeKeyCancel={false}
      canOutsideClickCancel={false}
      //TODO onClosed={} send event back
    >
      {message}
    </Alert>
  );
};

// Create a context for the global alert
const GlobalAlertContext = createContext(null);

export const useGlobalAlert = () => {
  return useContext(GlobalAlertContext);
};

//? use case for up hook
// const { showAlert } = useGlobalAlert();

// const handleButtonClick = () => {
//   showAlert('This is a global alert from MyComponent!');
// };

export const GlobalAlertProvider = ({ children }: any) => {
  const [globalAlert, setGlobalAlert] = useState({
    isOpen: false,
    message: '',
  });

  const showAlert = (message: string) => {
    setGlobalAlert({
      isOpen: true,
      message,
    });
  };

  const closeAlert = () => {
    setGlobalAlert({
      isOpen: false,
      message: '',
    });
  };

  useEffect(() => {
    // console.log('='.repeat(20));
    // console.log('hello');

    bus.addListener('show-alert', (message: string) => {
      showAlert(message);
    });

    // console.log(bus);
  }, []);

  return (
    <GlobalAlertContext.Provider value={{ showAlert, closeAlert } as any}>
      {children}
      <GlobalAlert isOpen={globalAlert.isOpen} message={globalAlert.message} onClose={closeAlert} />
    </GlobalAlertContext.Provider>
  );
};

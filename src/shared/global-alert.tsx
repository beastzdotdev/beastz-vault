import { Alert, Intent } from '@blueprintjs/core';
import React, { createContext, useEffect, useState } from 'react';
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
export const GlobalAlertContext = createContext(null);

export const GlobalAlertProvider = ({ children }: { children: React.JSX.Element }) => {
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
    bus.addListener('show-alert', (message: string) => {
      showAlert(message);
    });
  }, []);

  return (
    <GlobalAlertContext.Provider value={{ showAlert, closeAlert } as any}>
      {children}
      <GlobalAlert isOpen={globalAlert.isOpen} message={globalAlert.message} onClose={closeAlert} />
    </GlobalAlertContext.Provider>
  );
};

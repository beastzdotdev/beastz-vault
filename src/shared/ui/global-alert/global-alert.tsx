import { Alert, Intent } from '@blueprintjs/core';
import React, { createContext, useEffect, useState } from 'react';
import { bus } from '../../bus/bus';
import { BusMessageType } from '../..';

const GlobalAlert = ({
  isOpen,
  message,
  onClose,
}: {
  isOpen: boolean;
  message: BusMessageType | null;
  onClose: () => void;
}) => {
  return (
    <Alert
      className="max-w-none gorilla-global-alert"
      isOpen={isOpen}
      onClose={onClose}
      intent={Intent.NONE}
      icon="issue"
      confirmButtonText="Close"
      canEscapeKeyCancel={false}
      canOutsideClickCancel={false}
    >
      {message}
    </Alert>
  );
};

// Create a context for the global alert
export const GlobalAlertContext = createContext(null);

export const GlobalAlertProvider = ({ children }: { children: React.JSX.Element }) => {
  const [globalAlert, setGlobalAlert] = useState<{
    isOpen: boolean;
    message: BusMessageType | null;
    onClose: (() => void) | null;
  }>({
    isOpen: false,
    message: null,
    onClose: null,
  });

  const showAlert = (message: BusMessageType, onClose: (() => void) | null) => {
    setGlobalAlert({
      isOpen: true,
      message,
      onClose,
    });
  };

  const closeAlert = () => {
    // callback function is exists
    globalAlert.onClose?.();

    setGlobalAlert({
      isOpen: false,
      message: null,
      onClose: null,
    });
  };

  useEffect(() => {
    bus.addListener('show-alert', ({ message, onClose }) => {
      showAlert(message, onClose ?? null);
    });
  }, []);

  return (
    <GlobalAlertContext.Provider value={{ showAlert, closeAlert } as any}>
      {children}
      <GlobalAlert isOpen={globalAlert.isOpen} message={globalAlert.message} onClose={closeAlert} />
    </GlobalAlertContext.Provider>
  );
};

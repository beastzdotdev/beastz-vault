import React, { createContext, useEffect, useState } from 'react';
import { Alert, Intent } from '@blueprintjs/core';
import { BusMessageType } from '../../bus/bus.schema';
import { bus } from '../../bus/bus';

//TODO: I think this is huge perfomance hazard one global alert will cause a lot of rerenders
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
      className="max-w-none beastz-vault-global-alert"
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

interface GlobalAlertContextType {
  showAlert: (message: BusMessageType, onClose: (() => void) | null) => void;
  closeAlert: () => void;
}

// Create a context for the global alert
export const GlobalAlertContext = createContext<GlobalAlertContextType | null>(null);

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
    <GlobalAlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <GlobalAlert isOpen={globalAlert.isOpen} message={globalAlert.message} onClose={closeAlert} />
    </GlobalAlertContext.Provider>
  );
};

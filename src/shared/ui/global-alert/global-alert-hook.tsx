import { useContext } from 'react';
import { GlobalAlertContext } from './global-alert';

export const useGlobalAlert = () => {
  return useContext(GlobalAlertContext);
};

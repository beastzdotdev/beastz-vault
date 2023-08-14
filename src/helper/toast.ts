import { OverlayToaster, Position } from '@blueprintjs/core';

const AuthToaster = OverlayToaster.create({
  className: 'recipe-toaster',
  position: Position.TOP_RIGHT,
});

export const showErrorMessage = (message: string) => {
  AuthToaster.show({
    message,
    intent: 'danger',
    icon: 'warning-sign',
    timeout: 2000,
  });
};

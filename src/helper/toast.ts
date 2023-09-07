import { OverlayToaster, Position } from '@blueprintjs/core';

const AuthToaster = OverlayToaster.create({
  className: 'global toast',
  position: Position.TOP_RIGHT,
});

const CenterToat = OverlayToaster.create({
  className: 'global center toast',
  canEscapeKeyClear: false,
  autoFocus: true,
});

export const showErrorMessage = (message: string) => {
  AuthToaster.show({
    message,
    intent: 'danger',
    icon: 'warning-sign',
    timeout: 2000,
  });
};

export const showDefaultMessage = (message: string) => {
  CenterToat.show({
    message,
    intent: 'primary',
    icon: 'warning-sign',
    timeout: 200000,
    onDismiss: didTimeoutExpire => {
      console.log(didTimeoutExpire);
    },
  });
};

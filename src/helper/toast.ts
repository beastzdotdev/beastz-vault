import { OverlayToaster, Position } from '@blueprintjs/core';

const AuthToaster = OverlayToaster.create({
  className: 'global toast',
  position: Position.TOP_RIGHT,
});

const CenterToast = OverlayToaster.create({
  className: 'global center toast',
  canEscapeKeyClear: false,
  autoFocus: true,
});

export const toast = Object.freeze({
  error(message: string) {
    AuthToaster.show({
      message,
      intent: 'danger',
      icon: 'warning-sign',
      timeout: 2000,
    });
  },

  showDefaultMessage(message: string) {
    CenterToast.show({
      message,
      intent: 'primary',
      icon: 'warning-sign',
      timeout: 200000,
      onDismiss: didTimeoutExpire => {
        console.log(didTimeoutExpire);
      },
    });
  },
});

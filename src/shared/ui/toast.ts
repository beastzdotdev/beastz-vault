import { OverlayToaster, Position } from '@blueprintjs/core';
import { createRoot } from 'react-dom/client';

export const [fileContentProgressToast, globalCenterToast, globalTopRightToast] = await Promise.all(
  [
    OverlayToaster.createAsync(
      {
        canEscapeKeyClear: false,
        position: Position.BOTTOM_RIGHT,
        autoFocus: false,
      },
      {
        domRenderer: (toastr, containerEl) => createRoot(containerEl).render(toastr),
      }
    ),
    OverlayToaster.createAsync(
      {
        canEscapeKeyClear: false,
        autoFocus: true,
      },
      {
        domRenderer: (toastr, containerEl) => createRoot(containerEl).render(toastr),
      }
    ),

    OverlayToaster.createAsync(
      {
        position: Position.TOP_RIGHT,
      },
      {
        domRenderer: (toastr, containerEl) => createRoot(containerEl).render(toastr),
      }
    ),
  ]
);

export const toast = Object.freeze({
  error(message: string) {
    globalTopRightToast.show({
      message,
      intent: 'danger',
      icon: 'warning-sign',
      timeout: 2000,
    });
  },

  showDefaultMessage(message: string) {
    globalCenterToast.show({
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

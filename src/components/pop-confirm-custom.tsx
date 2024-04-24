import { Popover, Classes, H5, Button, Intent } from '@blueprintjs/core';

export type Something = {
  children: React.ReactNode;
  text?: string;
  title?: string;
  isConfirm?: boolean;
  onSuccessClick?: () => void;
  doNotShowButton?: boolean;
};

export const PopConfirmCustom = (params: Something) => {
  return (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      portalClassName="foo"
      enforceFocus={false}
      content={
        <div key="text">
          <H5>{params?.title ?? 'Confirm deletion'}</H5>
          <p>
            {params?.text ??
              "Are you sure you want to delete these items? You won't be able to recover them."}
          </p>

          {params.doNotShowButton ? null : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
              <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                Cancel
              </Button>

              {params?.isConfirm ? (
                <Button
                  intent={Intent.PRIMARY}
                  className={Classes.POPOVER_DISMISS}
                  onClick={() => params.onSuccessClick?.()}
                >
                  Confirm
                </Button>
              ) : (
                <Button
                  intent={Intent.DANGER}
                  className={Classes.POPOVER_DISMISS}
                  onClick={() => params.onSuccessClick?.()}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      }
    >
      {params.children}
    </Popover>
  );
};

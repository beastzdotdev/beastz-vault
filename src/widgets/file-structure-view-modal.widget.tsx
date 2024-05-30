import { Button, Dialog, H3 } from '@blueprintjs/core';

type Params = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;

  title: string;
  children: JSX.Element;

  className?: string;
  showPrintButton?: boolean;
  showDownloadButton?: boolean;
  showLinkButton?: boolean;

  onClose?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onLink?: () => void;
};

export const FileStructureViewModalWidget = (params: Params) => {
  const {
    isOpen,
    setIsOpen,
    onClose,
    onDownload,
    onLink,
    onPrint,
    title,
    showDownloadButton,
    showLinkButton,
    showPrintButton,
    children,
    className,
  } = params;

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        usePortal
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
        transitionDuration={0}
        enforceFocus
        className={`!shadow-none !bg-transparent select-none rounded-none m-0 h-full w-auto ${className}`}
      >
        <div className="flex justify-between absolute top-0 left-0 right-0 p-5">
          <div className="flex items-center">
            <H3 className="font-extralight m-0">{title}</H3>
          </div>

          <div>
            {showPrintButton && (
              <Button
                outlined
                icon="print"
                className="rounded-full mr-2"
                onClick={() => onPrint?.()}
                text="Print"
              />
            )}

            {showDownloadButton && (
              <Button
                outlined
                icon="download"
                className="rounded-full mr-2"
                onClick={() => onDownload?.()}
              />
            )}

            {showLinkButton && (
              <Button
                outlined
                icon="link"
                className="rounded-full mr-2"
                onClick={() => onLink?.()}
              />
            )}

            <Button
              icon="cross"
              className="rounded-full"
              outlined
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>

        {children}
      </Dialog>
    </>
  );
};

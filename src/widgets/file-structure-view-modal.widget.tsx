import { Button, Dialog, H3 } from '@blueprintjs/core';

type Params<T> = {
  item: T;
  isOpen: boolean;
  title: string;
  children: JSX.Element;
  onClose: (item: T) => void;

  // optionals
  className?: string;
  showPrintButton?: boolean;
  showDownloadButton?: boolean;
  showLinkButton?: boolean;
  onPrint?: (item: T) => void;
  onDownload?: (item: T) => void;
  onLink?: (item: T) => void;
};

export const FileStructureViewModalWidget = <T,>(params: Params<T>) => {
  const {
    item,
    isOpen,
    title,
    children,
    onClose,

    showDownloadButton,
    showLinkButton,
    showPrintButton,
    className,
    onDownload,
    onLink,
    onPrint,
  } = params;

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={() => onClose(item)}
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
                onClick={() => onPrint?.(item)}
                text="Print"
              />
            )}

            {showDownloadButton && (
              <Button
                outlined
                icon="download"
                className="rounded-full mr-2"
                onClick={() => onDownload?.(item)}
              />
            )}

            {showLinkButton && (
              <Button
                outlined
                icon="link"
                className="rounded-full mr-2"
                onClick={() => onLink?.(item)}
              />
            )}
          </div>
        </div>

        {children}
      </Dialog>
    </>
  );
};

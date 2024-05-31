import { Button } from '@blueprintjs/core';
import { useState } from 'react';
import { FileStructureViewModalWidget } from '../../widgets/file-structure-view-modal.widget';

export const ModalTestPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>

      <FileStructureViewModalWidget
        item={{} as object}
        isOpen={isOpen}
        title={'Hello'}
        showPrintButton
        showDownloadButton
        showLinkButton
        onClose={() => setIsOpen(false)}
      >
        <img
          id="focused-for-print"
          style={{
            position: 'absolute',

            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',

            objectFit: 'cover',
            objectPosition: 'center',

            maxWidth: '100%',
            maxHeight: '100%',
            aspectRatio: '16 / 9',
          }}
          src="https://ioflood.com/blog/wp-content/uploads/2023/10/java_logo_dice_random-300x300.jpg.webp"
          alt="Image not loaded, sorry"
        />
      </FileStructureViewModalWidget>
    </>
  );
};

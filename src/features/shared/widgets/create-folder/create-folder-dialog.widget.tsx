import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Intent,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
import { useState } from 'react';
import { useInjection } from 'inversify-react';
import { useFormik } from 'formik';
import { FormErrorMessage } from '../../../../components/form-error-message';
import { zodFormikErrorAdapter } from '../../../../shared';
import { verifyFolderNameInput, verifyFolderNameInputFields } from './create-folder-validation';
import { SharedController } from '../../state/shared.controller';

export const CreateFolderDialogWidget = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}): React.JSX.Element => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const sharedController = useInjection(SharedController);

  const folderNameForm = useFormik({
    initialValues: {
      folderName: '',
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(verifyFolderNameInput),
    onSubmit: async (values, { resetForm }) => {
      const urlObj = new URL(window.location.href);
      const rootParentId = urlObj.searchParams.get('root_parent_id');
      const parentId = urlObj.searchParams.get('id');

      await sharedController.createFolder({
        name: values.folderName,
        parentId: parentId ? parseInt(parentId) : undefined,
        rootParentId: rootParentId ? parseInt(rootParentId) : undefined,
      });

      resetForm();
      setIsOpen(false);
    },
  });

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title="Create folder"
        onClose={() => setIsOpen(!isOpen)}
        isCloseButtonShown
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
      >
        <DialogBody>
          <FormGroup>
            <InputGroup
              autoFocus
              tabIndex={1}
              className="clear-start"
              intent={
                folderNameForm.errors.folderName && showErrorMessage ? Intent.DANGER : Intent.NONE
              }
              placeholder="Enter folder name"
              name={verifyFolderNameInputFields.folderName}
              value={folderNameForm.values.folderName}
              onChange={folderNameForm.handleChange}
            />
            {showErrorMessage && <FormErrorMessage message={folderNameForm.errors.folderName} />}
          </FormGroup>
        </DialogBody>

        <DialogFooter
          minimal
          actions={
            <>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
              <Button
                intent={Intent.PRIMARY}
                onClick={() => {
                  setShowErrorMessage(true);
                  folderNameForm.submitForm();
                }}
              >
                Save
              </Button>
            </>
          }
        />
      </Dialog>
    </>
  );
};

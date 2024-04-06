import filenamify from 'filenamify/browser';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Intent,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
import { useCallback, useState } from 'react';
import { useInjection } from 'inversify-react';
import { useFormik } from 'formik';
import { FormErrorMessage } from '../../../../components/form-error-message';
import { SharedController } from '../../state/shared.controller';
import { getFileStructureUrlParams } from '../../helper/get-url-params';
import {
  createFolderDialogValidation,
  createFolderDialogValidationFields,
} from './create-folder-dialog-validation';
import { FileStructureApiService } from '../../../../shared/api';
import { zodFormikErrorAdapter } from '../../../../shared/helper';

export const CreateFolderDialogWidget = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}): React.JSX.Element => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const sharedController = useInjection(SharedController);
  const fileStructureApiService = useInjection(FileStructureApiService);

  const folderNameForm = useFormik({
    initialValues: {
      folderName: '',
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(createFolderDialogValidation),
    onSubmit: async (values, { resetForm, setFieldError }) => {
      const { rootParentId, parentId } = getFileStructureUrlParams();

      if (values.folderName !== filenamify(values.folderName)) {
        setFieldError(createFolderDialogValidationFields.folderName, 'Invalid folder name');
        return;
      }

      const { data: duplData, error: duplError } = await fileStructureApiService.detectDuplicate({
        titles: [values.folderName],
        isFile: false,
        parentId,
      });

      if (duplError) {
        throw new Error('Something unexpected happend');
      }

      if (duplData?.[0]?.hasDuplicate) {
        setFieldError(
          createFolderDialogValidationFields.folderName,
          'Duplicate name detected, please use another one'
        );
        return;
      }

      const { data, error } = await fileStructureApiService.createFolder({
        name: values.folderName,
        parentId,
        rootParentId,
        keepBoth: false, // since validation happens this can be false everytime
      });

      if (error || !data) {
        throw new Error('Could not create folder');
      }

      sharedController.createFileStructureInState(data, false);

      resetForm();
      setIsOpen(false);
    },
  });

  const onClickinngSaveButton = useCallback(() => {
    setShowErrorMessage(true);
    folderNameForm.submitForm();
  }, [folderNameForm]);

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
        <div
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onClickinngSaveButton();
            }
          }}
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
                name={createFolderDialogValidationFields.folderName}
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
                <Button intent={Intent.PRIMARY} onClick={() => onClickinngSaveButton()}>
                  Save
                </Button>
              </>
            }
          />
        </div>
      </Dialog>
    </>
  );
};

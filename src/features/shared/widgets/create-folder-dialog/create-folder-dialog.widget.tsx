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
import { FileStructureApiService, zodFormikErrorAdapter } from '../../../../shared';
import { SharedController } from '../../state/shared.controller';
import {
  createFolderDialogValidation,
  createFolderDialogValidationFields,
} from './create-folder-dialog-validation';
import { getFileStructureUrlParams } from '../../helper/get-url-params';

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
      // const urlObj = new URL(window.location.href);
      // const rootParentId = urlObj.searchParams.get('root_parent_id');
      // const parentId = urlObj.searchParams.get('id');

      const { data: duplicateData, error } = await fileStructureApiService.detectDuplicate({
        titles: [values.folderName],
        isFile: false,
        parentId,
      });

      if (error) {
        throw new Error('Something unexpected happend');
      }

      if (duplicateData?.[0]?.hasDuplicate) {
        setFieldError(
          createFolderDialogValidationFields.folderName,
          'Duplicate name detected, please use another one'
        );
        return;
      }

      await sharedController.createFolder({
        name: values.folderName,
        parentId,
        rootParentId,
        keepBoth: false, // since validation happens this can be false everytime
      });

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

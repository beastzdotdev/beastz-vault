import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Intent,
  FormGroup,
  RadioCard,
  RadioGroup,
  Classes,
} from '@blueprintjs/core';
import { useFormik } from 'formik';
import {
  DuplicateNameChoice,
  DuplicateNameDialogValidation,
  duplicateNameDialogValidation,
  duplicateNameDialogValidationFields,
} from './duplicate-name-dialog-validation';
import { classNames, zodFormikErrorAdapter } from '../../../../shared/helper';

export const DuplicateNameDialogWidget = ({
  isOpen,
  setIsOpen,
  callBack,
}: {
  callBack: (params: { keepBoth: boolean }) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}): React.JSX.Element => {
  const folderNameForm = useFormik<DuplicateNameDialogValidation>({
    initialValues: {
      selectedChoice: DuplicateNameChoice.REPLACE,
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(duplicateNameDialogValidation),
    onSubmit: async (values, { resetForm }) => {
      const keepBoth = values.selectedChoice === DuplicateNameChoice.KEEP_BOTH;
      resetForm();
      setIsOpen(false);

      await callBack({ keepBoth });
    },
  });

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title="Upload options"
        onClose={() => setIsOpen(!isOpen)}
        isCloseButtonShown
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
      >
        <DialogBody>
          <FormGroup
            className="docs-control-card-group"
            label={
              <span className={classNames(Classes.TEXT_MUTED)}>
                Existing file or folder name already exists in this directory so what do you want to
                do ?
              </span>
            }
          >
            <RadioGroup
              className="grid gap-4 grid-flow-col mt-2"
              selectedValue={folderNameForm.values.selectedChoice}
              onChange={e => {
                folderNameForm.setFieldValue(
                  duplicateNameDialogValidationFields.selectedChoice,
                  e.currentTarget.value
                );
              }}
            >
              <RadioCard value={DuplicateNameChoice.REPLACE} showAsSelectedWhenChecked>
                Replace
                <br />
                <span className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>
                  Replace existing file or folder with the same name
                </span>
              </RadioCard>

              <RadioCard value={DuplicateNameChoice.KEEP_BOTH} showAsSelectedWhenChecked>
                Keep both
                <br />
                <span className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>
                  Keep both existing file or folder and selected one as well
                </span>
              </RadioCard>
            </RadioGroup>
          </FormGroup>
        </DialogBody>

        <DialogFooter
          minimal
          actions={
            <>
              <Button onClick={() => setIsOpen(false)}>Close</Button>
              <Button intent={Intent.PRIMARY} onClick={() => folderNameForm.submitForm()}>
                Save
              </Button>
            </>
          }
        />
      </Dialog>
    </>
  );
};

import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  ControlGroup,
  InputGroup,
  FileInput,
} from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fields, zodFormikErrorAdapter } from '../../../shared/helper';
import { UserSupportMessageFieldsSchema } from '../validation/user-support-message-validation-schema';
import { FormErrorMessage } from '../../../components/form-error-message';
import { UserSupportController } from '../state/user-support.controller';

type Params = {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
};

export const UserSupportMessageModal = observer(({ isOpen, toggleIsOpen }: Params) => {
  const userSupportController = useInjection(UserSupportController);
  const { id } = useParams<{ id: string }>();

  const store = useLocalObservable(() => ({
    loading: false,
    fileText: 'Choose file...',

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setFileText(text: string) {
      this.fileText = text;
    },

    clear() {
      this.loading = false;
      this.fileText = 'Choose file...';
    },
  }));

  const form = useFormik({
    initialValues: {
      text: '',
      file: undefined,
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(UserSupportMessageFieldsSchema),
    onSubmit: async (values, { resetForm }) => {
      resetForm();

      if (!id) {
        throw new Error('id not found');
      }

      await userSupportController.sendMessage(id, {
        text: values.text,
        file: values.file ?? undefined,
      });
    },
  });

  const formFields = fields<(typeof form)['initialValues']>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      store.clear();
    }
  }, [isOpen, store]);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title="Send message"
        onClose={() => toggleIsOpen(false)}
        className="w-fit"
        isCloseButtonShown
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
      >
        <div
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setShowErrorMessage(true);
              form.submitForm();
            }
          }}
        >
          <DialogBody>
            <ControlGroup fill vertical style={{ width: '500px' }} className="mt-10">
              <FormGroup label="Text" labelInfo="(required)">
                <InputGroup
                  intent={form.errors.text && showErrorMessage ? Intent.DANGER : Intent.NONE}
                  placeholder="Enter text"
                  name={formFields.text}
                  value={form.values.text}
                  onChange={form.handleChange}
                />
                {showErrorMessage && <FormErrorMessage message={form.errors.text} />}
              </FormGroup>

              <FormGroup label="File" labelInfo="(optional)" className="mt-5">
                <FileInput
                  fill
                  inputProps={{
                    accept: 'image/png, image/gif, image/jpeg',
                    type: 'file',
                    multiple: false,
                  }}
                  text={store.fileText}
                  onInputChange={e => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      store.setFileText(file.name);
                      form.setFieldValue(formFields.file, file);
                    }
                  }}
                />

                {showErrorMessage && <FormErrorMessage message={form.errors.file} />}
              </FormGroup>
            </ControlGroup>
          </DialogBody>

          <DialogFooter
            minimal
            actions={
              <>
                <Button onClick={() => toggleIsOpen(false)}>Close</Button>
                <Button
                  intent={Intent.PRIMARY}
                  onClick={() => {
                    setShowErrorMessage(true);
                    form.submitForm();
                  }}
                  disabled={store.loading}
                >
                  Save
                </Button>
              </>
            }
          />
        </div>
      </Dialog>
    </>
  );
});

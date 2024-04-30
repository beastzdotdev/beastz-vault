import { useFormik } from 'formik';
import { useInjection } from 'inversify-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  InputGroup,
  Callout,
  Tooltip,
} from '@blueprintjs/core';

import { toast } from '../../../../shared/ui';
import { ExceptionMessageCode } from '../../../../shared/enum';
import { sleep, zodFormikErrorAdapter } from '../../../../shared/helper';
import { ClientApiError } from '../../../../shared/errors';
import { RootFileStructure } from '../../../../shared/model';
import { FileStructureApiService } from '../../../../shared/api';
import { FormErrorMessage } from '../../../../components/form-error-message';
import { constants } from '../../../../shared/constants';
import { encryption } from '../../../../shared/encryption';
import {
  fsEncryptionValidation,
  fsEncryptionValidationFields,
} from './file-structure-encrypt-validation';

type Params = {
  selectedNodes: RootFileStructure[];
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
};

export const FileStructureEncrypt = observer(({ selectedNodes, isOpen, toggleIsOpen }: Params) => {
  const fileStructureApiService = useInjection(FileStructureApiService);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const form = useFormik({
    initialValues: {
      secret: '',
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(fsEncryptionValidation),
    onSubmit: async (values, { resetForm }) => {
      await encryptFile(values.secret);
      resetForm();
    },
  });

  const store = useLocalObservable(() => ({
    loading: false,

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    clear() {
      this.loading = false;
    },
  }));

  const onError = (error?: ClientApiError) => {
    if (error?.message === ExceptionMessageCode.FS_SAME_NAME) {
      toast.error('File/Folder with same name exists already');
    } else {
      toast.error(error?.message || 'Sorry, something went wrong');
    }

    form.resetForm();
    store.clear();
    toggleIsOpen(false); // will cause rerender for bin
  };

  const encryptFile = async (secret: string) => {
    const selectedFsId = selectedNodes[0].id;

    store.setLoading(true);

    const startTime = new Date(); // Start time

    // download file from server
    const { data, error } = await fileStructureApiService.downloadById(selectedFsId, false);

    if (error || !data) {
      onError(error);
      return;
    }

    // validate and gen new name
    const splited = data.title.split('.');

    if (splited.length <= 0) {
      throw new Error('Should not happen');
    }

    try {
      const newName =
        splited.length === 1
          ? splited[0] + constants.ENCRYPTION_EXT
          : splited.slice(0, -1).join('.') + constants.ENCRYPTION_EXT;

      // encrypt file buffer
      const encryptedFileUint8Array = await encryption.aes256gcm.encryptBuffer(
        new Uint8Array(await data.file.arrayBuffer()),
        secret
      );

      // convert encrypted buffer to file
      const encryptedFile = new File([encryptedFileUint8Array], newName, {
        type: 'application/octet-stream',
      });

      const { data: responseData, error: responseError } =
        await fileStructureApiService.uploadEncryptedFile({
          encryptedFile,
          fileStructureId: selectedFsId,
        });

      const endTime = new Date(); // Calculate time taken

      console.log('took ' + (endTime.getTime() - startTime.getTime()) + ' ms');

      // this is necessary because if axios took less than 200ms animation seems weird
      if (endTime.getTime() - startTime.getTime() < 200) {
        // add another 400 ms waiting
        await sleep(400);
      }

      if (responseError || !responseData) {
        onError(responseError);
        return;
      }

      window.location.reload();
    } catch (error) {
      onError();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      store.clear();
    }
  }, [isOpen, store]);

  const copyButton = (
    <Tooltip content="Copy before save" popoverClassName="select-none" inheritDarkTheme={true}>
      <Button
        icon="clipboard"
        minimal
        onClick={() => window.navigator.clipboard.writeText(form.values.secret)}
      />
    </Tooltip>
  );

  const onSaveClick = () => {
    setShowErrorMessage(true);
    form.submitForm();
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        title="Encrypt"
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
              onSaveClick();
            }
          }}
        >
          <DialogBody>
            <FormGroup label="Secret message" labelInfo="(required)" className="select-none">
              <InputGroup
                className="min-w-96"
                autoFocus
                tabIndex={1}
                inputClassName="select-text"
                intent={form.errors.secret && showErrorMessage ? Intent.DANGER : Intent.NONE}
                name={fsEncryptionValidationFields.secret}
                value={form.values.secret}
                onChange={form.handleChange}
                rightElement={copyButton}
              />
              {showErrorMessage && <FormErrorMessage message={form.errors.secret} />}
            </FormGroup>

            <Callout icon="warning-sign" intent="warning" className="select-none">
              Please save you secret message somewhere before clicking save button,
              <br />
              We do not store any encryption password anywhere.
            </Callout>
          </DialogBody>

          <DialogFooter
            className="select-none"
            minimal
            actions={
              <>
                <Button onClick={() => toggleIsOpen(false)}>Close</Button>
                <Button
                  intent={Intent.PRIMARY}
                  onClick={() => onSaveClick()}
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

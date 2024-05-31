import { DialogBody, FormGroup, InputGroup, Button } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useMemo, useEffect } from 'react';
import { FormErrorMessage } from '../../../../../components/form-error-message';
import { api } from '../../../../../shared/api';
import { constants } from '../../../../../shared/constants';
import { encryption } from '../../../../../shared/encryption';
import { differentiate, readTextFromFile } from '../../../../../shared/helper';
import { RootFileStructure } from '../../../../../shared/model';
import { toast } from '../../../../../shared/ui';
import { FileViewStore } from '../file-view-store';
import {
  FileViewImg,
  FileViewNonIdealState,
  FileViewAudio,
  FileViewVideo,
  FileViewText,
} from './file-view-components';

export const FileViewModalBody = observer(({ item }: { item: RootFileStructure }) => {
  const fileViewStore = useInjection(FileViewStore);
  const type = useMemo(() => differentiate(item?.mimeType), [item?.mimeType]);

  const encryptionStore = useLocalObservable(() => ({
    secret: '',
    isEncryptedViewActive: item?.isEncrypted,

    setSecret(secret: string) {
      this.secret = secret;
    },

    setIsEncryptedViewActive(value: boolean) {
      this.isEncryptedViewActive = value;
    },

    clear() {
      this.secret = '';
      this.isEncryptedViewActive = false;
    },
  }));
  const textStore = useLocalObservable(() => ({
    text: '',
    loading: false,
    forceShowText: false,
    encryptErrorMessage: null as string | null,

    setText(text: string) {
      this.text = text;
    },

    setLoading(value: boolean) {
      this.loading = value;
    },

    setForceShowText(value: boolean) {
      this.forceShowText = value;
    },

    setEncryptErrorMessage(value: string | null) {
      this.encryptErrorMessage = value;
    },

    clear() {
      this.text = '';
      this.forceShowText = false;
      this.loading = false;
      this.encryptErrorMessage = null;
    },

    async setTextInitial(): Promise<void> {
      if (item.isEncrypted) {
        return;
      }

      let finalText = '';

      try {
        if (type === 'text' && item.absRelativePath) {
          const url = item.absRelativePath.replace(constants.path.backend.url, '');
          const textResponse = await api.get(url, { responseType: 'text' });

          finalText = textResponse.data;
        }
      } catch (error) {
        finalText = '';
      }

      this.setText(finalText);
    },
  }));

  useEffect(
    () => {
      if (type === 'text') {
        textStore.setTextInitial();
      }

      if (!fileViewStore.isModalOpen) {
        textStore.clear();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileViewStore.isModalOpen]
  );

  const onDecrypt = async () => {
    if (!item.absRelativePath) {
      return;
    }

    try {
      const url = item.absRelativePath.replace(constants.path.backend.url, '');
      const response = await api.get<Blob>(url, { responseType: 'blob' });

      const decryptedFile = await encryption.aes256gcm
        .decryptBuffer(new Uint8Array(await response.data.arrayBuffer()), encryptionStore.secret)
        .catch(() => null);

      if (!decryptedFile) {
        textStore.setEncryptErrorMessage('Sorry, incorrect password');
        return;
      }

      const file = new File([decryptedFile], item.name);

      const text = await readTextFromFile(file);

      console.log(text);

      textStore.setText(text);
      encryptionStore.setIsEncryptedViewActive(false);
      textStore.setForceShowText(true);

      //TODO this will be decrypted url for img and other
      // store.setUrl(URL.createObjectURL(file));
    } catch (error) {
      console.log('='.repeat(20));
      console.error(error);
      toast.error('Sorry, something went wrong');
    }
  };

  if (encryptionStore.isEncryptedViewActive) {
    return (
      <DialogBody className="max-h-none flex flex-col">
        <div className="flex-1 overflow-hidden flex justify-center">
          <FormGroup label="Secret message" labelInfo="(required)" className="select-none">
            <InputGroup
              className="min-w-96 border border-gray-200 border-opacity-40"
              autoFocus
              tabIndex={1}
              inputClassName="select-text"
              intent="success"
              name="Secret"
              value={encryptionStore.secret}
              onChange={e => encryptionStore.setSecret(e.target.value)}
            />

            {textStore.encryptErrorMessage && (
              <FormErrorMessage message={textStore.encryptErrorMessage} />
            )}

            <Button className="mt-5" text="Decrypt" onClick={onDecrypt} />
          </FormGroup>
        </div>
      </DialogBody>
    );
  }

  switch (type) {
    case 'image':
      return <FileViewImg item={item} />;
    case 'other':
      return <FileViewNonIdealState item={item} />;
    case 'audio':
      return <FileViewAudio item={item} />;
    case 'video':
      return <FileViewVideo item={item} />;
    case 'text':
      return <FileViewText item={item} />;
    default:
      return <></>;
  }
});

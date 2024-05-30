import {
  Button,
  DialogBody,
  FormGroup,
  H2,
  Icon,
  InputGroup,
  NonIdealState,
  NonIdealStateIconSize,
} from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useInjection } from 'inversify-react';
import { RootFileStructure } from '../../../shared/model';
import { constants } from '../../../shared/constants';
import { differentiate, openLink, readTextFromFile, sleep } from '../../../shared/helper';
import { FileStructureApiService, api } from '../../../shared/api';
import { TextFileEditor } from '../../../widgets/text-editor';
import { toast } from '../../../shared/ui';
import { SharedController } from '../../shared/state/shared.controller';
import { encryption } from '../../../shared/encryption';
import { FormErrorMessage } from '../../../components/form-error-message';
import { FileStructureViewModalWidget } from '../../../widgets/file-structure-view-modal.widget';
import { GeneralFileType } from '../../../shared/types';

type Params = {
  selectedNode: RootFileStructure;
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  isInBin: boolean;
};

type Store = {
  url: string;
  secret: string;
  isEncryptedViewActive: boolean | null;
  setUrl(url: string): void;
  setSecret(secret: string): void;
  setIsEncryptedViewActive(value: boolean): void;
  clear(): void;
};

type TextStore = {
  text: string;
  loading: boolean;
  forceShowText: boolean;
  encryptErrorMessage: string | null;
  setText(text: string): void;
  setLoading(value: boolean): void;
  setForceShowText(value: boolean): void;
  setEncryptErrorMessage(value: string | null): void;
  clear(): void;
  setTextInitial(): Promise<void>;
};

export const FileStructureFileView = observer(
  ({ selectedNode, isOpen, toggleIsOpen, isInBin }: Params) => {
    const fileStructureApiService = useInjection(FileStructureApiService);
    const type = differentiate(selectedNode?.mimeType);

    const store = useLocalObservable<Store>(() => ({
      url: selectedNode.absRelativePath ?? '',
      secret: '',
      isEncryptedViewActive: selectedNode.isEncrypted,

      setUrl(url: string) {
        this.url = url;
      },

      setSecret(secret: string) {
        this.secret = secret;
      },

      setIsEncryptedViewActive(value: boolean) {
        this.isEncryptedViewActive = value;
      },

      clear() {
        this.url = '';
        this.secret = '';
        this.isEncryptedViewActive = false;
      },
    }));

    //TODO need backup mimetype in backend and remove forceShow text and allow other types of file to be encrypted
    const textStore = useLocalObservable<TextStore>(() => ({
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
        if (selectedNode.isEncrypted) {
          return;
        }

        let finalText = '';

        try {
          if (type === 'text' && selectedNode.absRelativePath) {
            const url = selectedNode.absRelativePath.replace(constants.path.backend.url, '');
            const textResponse = await api.get(url, { responseType: 'text' });

            finalText = textResponse.data;
          }
        } catch (error) {
          finalText = '';
        }

        this.setText(finalText);
      },
    }));

    const closeDialog = () => {
      store.clear();
      textStore.clear();
      toggleIsOpen(false);
    };

    useEffect(() => {
      if (type === 'text') {
        textStore.setTextInitial();
      }

      if (!isOpen) {
        store.clear();
        textStore.clear();
      }
    }, [isOpen, store, textStore, type]);

    const onDownload = async () => {
      const { error } = await fileStructureApiService.downloadById(selectedNode.id);
      if (error) {
        toast.error(error?.message ?? 'Sorry, something went wrong');
        return;
      }
    };

    const onLink = () => {
      openLink(selectedNode.absRelativePath);
    };

    const onPrint = () => {
      window.print();
    };

    const title = useMemo(() => {
      console.log(123);

      return (
        selectedNode.title + (selectedNode?.fileExstensionRaw ?? '') + (isInBin ? ' - Bin' : '')
      );
    }, [isInBin, selectedNode?.fileExstensionRaw, selectedNode.title]);

    return (
      <>
        <FileStructureViewModalWidget
          isOpen={isOpen}
          setIsOpen={toggleIsOpen}
          onClose={() => closeDialog()}
          title={title}
          showPrintButton={type === 'image'}
          showDownloadButton={!isInBin}
          showLinkButton={!isInBin}
          onPrint={onPrint}
          onDownload={onDownload}
          onLink={onLink}
        >
          <RenderModalBody
            closeDialog={closeDialog}
            selectedNode={selectedNode}
            store={store}
            textStore={textStore}
            type={type}
            isInBin={isInBin}
          />
        </FileStructureViewModalWidget>
      </>
    );
  }
);

const RenderModalBody = observer(
  ({
    store,
    selectedNode,
    textStore,
    type,
    closeDialog,
    isInBin,
  }: {
    store: Store;
    selectedNode: RootFileStructure;
    textStore: TextStore;
    type: GeneralFileType;
    closeDialog: () => void;
    isInBin?: boolean;
  }) => {
    const fileStructureApiService = useInjection(FileStructureApiService);
    const sharedController = useInjection(SharedController);

    const onDecrypt = async () => {
      if (!selectedNode.absRelativePath) {
        return;
      }

      try {
        const url = selectedNode.absRelativePath.replace(constants.path.backend.url, '');
        const response = await api.get<Blob>(url, { responseType: 'blob' });

        const decryptedFile = await encryption.aes256gcm
          .decryptBuffer(new Uint8Array(await response.data.arrayBuffer()), store.secret)
          .catch(() => null);

        if (!decryptedFile) {
          textStore.setEncryptErrorMessage('Sorry, incorrect password');
          return;
        }

        const file = new File([decryptedFile], selectedNode.name);

        const text = await readTextFromFile(file);

        console.log(text);

        textStore.setText(text);
        store.setIsEncryptedViewActive(false);
        textStore.setForceShowText(true);

        //TODO this will be decrypted url for img and other
        // store.setUrl(URL.createObjectURL(file));
      } catch (error) {
        console.log('='.repeat(20));
        console.error(error);
        toast.error('Sorry, something went wrong');
      }
    };

    if (store.isEncryptedViewActive) {
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
                value={store.secret}
                onChange={e => store.setSecret(e.target.value)}
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

    if (type === 'image') {
      return (
        <img
          id="focused-for-print"
          src={store.url}
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
          crossOrigin="use-credentials"
          alt="Image not loaded, sorry"
        />
      );
    }

    if (type === 'other') {
      return <RenderNonIdealState selectedNode={selectedNode} />;
    }

    if (type === 'audio') {
      return (
        <div className="w-[500px]">
          <audio controls src={store.url} style={{ width: '100%' }} />
        </div>
      );
    }

    if (type === 'video') {
      return (
        <video
          className="max-w-2xl h-auto"
          controls
          controlsList="nodownload noplaybackrate"
          src={store.url}
          disablePictureInPicture
        />
      );
    }

    if (type === 'text' || textStore.forceShowText) {
      return (
        <div className="w-[900px]">
          <TextFileEditor
            hideNewInMenu
            hideReplaceSwitch
            disableTitleEdit
            hideFooter={textStore.forceShowText || isInBin}
            readOnly={textStore.forceShowText || isInBin}
            title={selectedNode.title}
            text={textStore.text}
            loading={textStore.loading}
            onSave={async ({ text }) => {
              console.log(text === textStore.text);

              if (text === textStore.text) {
                return;
              }

              textStore.setLoading(true);

              const startTime = new Date(); // Start time
              const { data, error } = await fileStructureApiService.replaceTextById(
                selectedNode.id,
                {
                  text,
                }
              );
              const endTime = new Date();

              // this is necessary because if axios took less than 200ms animation seems weird
              if (endTime.getTime() - startTime.getTime() < 200) {
                // add another 400 ms waiting
                await sleep(400);
              }

              textStore.setLoading(false);

              if (error || !data) {
                toast.error(error?.message || 'Sorry, something went wrong');
                return;
              }

              sharedController.createFileStructureInState(data, true);
              closeDialog();
            }}
            onClose={() => closeDialog()}
          />
        </div>
      );
    }
  }
);

const RenderNonIdealState = ({ selectedNode }: { selectedNode: RootFileStructure }) => (
  <NonIdealState
    title={<H2 className="font-extralight !text-neutral-50">Sorry, file type not supported</H2>}
    className="xxxs"
    layout="horizontal"
    iconMuted={false}
    description={
      <div>
        <p>Try opening using link button (support will be added soon)</p>

        <Button
          outlined
          className="rounded-full mt-4"
          icon="link"
          onClick={() => openLink(selectedNode.absRelativePath)}
          text="Open"
        />
      </div>
    }
    icon={<Icon icon="issue" size={NonIdealStateIconSize.STANDARD} className="text-neutral-50" />}
  />
);

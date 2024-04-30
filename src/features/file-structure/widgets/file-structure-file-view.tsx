import {
  Button,
  Dialog,
  DialogBody,
  FormGroup,
  H2,
  H3,
  Icon,
  InputGroup,
  NonIdealState,
  NonIdealStateIconSize,
} from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
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

type Params = {
  selectedNode: RootFileStructure;
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  isInBin: boolean;
};

export const FileStructureFileView = observer(
  ({ selectedNode, isOpen, toggleIsOpen, isInBin }: Params) => {
    const fileStructureApiService = useInjection(FileStructureApiService);
    const sharedController = useInjection(SharedController);
    const type = differentiate(selectedNode?.mimeType);

    const store = useLocalObservable(() => ({
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

    return (
      <>
        <Dialog
          isOpen={isOpen}
          onClose={() => closeDialog()}
          canOutsideClickClose
          canEscapeKeyClose
          shouldReturnFocusOnClose
          transitionDuration={0}
          enforceFocus
          className="shadow-none fixed top-0 left-0 bottom-0 m-0 right-0 w-full h-full !bg-transparent overflow-hidden select-none"
        >
          {store.isEncryptedViewActive ? (
            <DialogBody className="max-h-none flex flex-col">
              <div className="pb-5 flex justify-between">
                <div className="flex items-center">
                  <H3 className="font-extralight m-0 pl-3">
                    {selectedNode.title + (selectedNode?.fileExstensionRaw ?? '')}
                    {isInBin && ' - Bin'}
                  </H3>
                </div>

                <div>
                  <Button
                    outlined
                    className="rounded-full mr-4"
                    icon="download"
                    onClick={async () => {
                      const { error } = await fileStructureApiService.downloadById(selectedNode.id);
                      if (error) {
                        toast.error(error?.message ?? 'Sorry, something went wrong');
                        return;
                      }
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    icon="link"
                    className="rounded-full mr-2"
                    outlined
                    onClick={() => openLink(selectedNode.absRelativePath)}
                  />
                  <Button
                    icon="cross"
                    className="rounded-full"
                    outlined
                    onClick={() => closeDialog()}
                  />
                </div>
              </div>

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
          ) : (
            <DialogBody className="max-h-none flex flex-col">
              <div className="pb-5 flex justify-between">
                <div className="flex items-center">
                  <H3 className="font-extralight m-0 pl-3">
                    {selectedNode.title + (selectedNode?.fileExstensionRaw ?? '')}
                    {isInBin && ' - Bin'}
                  </H3>
                </div>

                <div>
                  {type === 'image' && (
                    <Button
                      outlined
                      className="rounded-full mr-4"
                      icon="print"
                      onClick={() => window.print()}
                    >
                      Print
                    </Button>
                  )}

                  <Button
                    outlined
                    className="rounded-full mr-4"
                    icon="download"
                    onClick={async () => {
                      const { error } = await fileStructureApiService.downloadById(selectedNode.id);
                      if (error) {
                        toast.error(error?.message ?? 'Sorry, something went wrong');
                        return;
                      }
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    icon="link"
                    className="rounded-full mr-2"
                    outlined
                    onClick={() => openLink(selectedNode.absRelativePath)}
                  />
                  <Button
                    icon="cross"
                    className="rounded-full"
                    outlined
                    onClick={() => closeDialog()}
                  />
                </div>
              </div>

              <div
                className="flex-1 overflow-hidden flex justify-center"
                onClick={() => {
                  if (type === 'image' || type === 'other') {
                    closeDialog();
                  }
                }}
              >
                {/* Start */}

                {type === 'other' && (
                  <NonIdealState
                    title={
                      <H2 className="font-extralight !text-neutral-50">
                        Sorry, file type not supported
                      </H2>
                    }
                    className="xxxs"
                    layout="horizontal"
                    iconMuted={false}
                    description={
                      <div>
                        <p>Try in another link</p>

                        <Button
                          outlined
                          className="rounded-full mt-4"
                          icon="link"
                          onClick={() => openLink(selectedNode.absRelativePath)}
                          text="Open"
                        />
                      </div>
                    }
                    icon={
                      <Icon
                        icon="issue"
                        size={NonIdealStateIconSize.STANDARD}
                        className="text-neutral-50"
                      />
                    }
                  />
                )}

                {type === 'image' && (
                  <img
                    id="focused-for-print"
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      aspectRatio: '16 / 9',
                    }}
                    crossOrigin="use-credentials"
                    src={store.url}
                    alt="Image not loaded, sorry"
                  />
                )}

                {type === 'audio' && (
                  <div className="flex items-center">
                    <audio controls src={store.url} />
                  </div>
                )}

                {type === 'video' && <video controls src={store.url} disablePictureInPicture />}

                {(type === 'text' || textStore.forceShowText) && (
                  <>
                    <div className="w-[900px]">
                      <TextFileEditor
                        hideNewInMenu
                        hideReplaceSwitch
                        disableTitleEdit
                        hideFooter={textStore.forceShowText}
                        readOnly={textStore.forceShowText}
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
                            { text }
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
                  </>
                )}

                {/* End */}
              </div>
            </DialogBody>
          )}
        </Dialog>
      </>
    );
  }
);

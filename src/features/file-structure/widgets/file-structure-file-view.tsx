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
import { differentiate, openLink, sleep } from '../../../shared/helper';
import { FileStructureApiService, api } from '../../../shared/api';
import { TextFileEditor } from '../../../widgets/text-editor';
import { toast } from '../../../shared/ui';
import { SharedController } from '../../shared/state/shared.controller';

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
      isEncryptedViewActive: selectedNode.isEncrypted,

      //temp
      secret: '',
      url: '',

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

      setText(text: string) {
        this.text = text;
      },

      setLoading(value: boolean) {
        this.loading = value;
      },

      clear() {
        this.text = '';
        this.loading = false;
      },

      async setTextInitial(): Promise<void> {
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
    // const closeDialog = useCallback(() => {
    //   store.clear();
    //   textStore.clear();
    //   closeDialog();
    // }, [store, textStore]);

    useEffect(() => {
      if (type === 'text') {
        textStore.setTextInitial();
      }

      if (!isOpen) {
        store.clear();
        textStore.clear();
      }
    }, [isOpen, store, textStore, type]);

    // const onDecrypt = async () => {
    //   try {
    //     const url = getFileUrl.replace(constants.path.backend.url, '');
    //     const response = await api.get<Blob>(url, { responseType: 'blob' });

    //     const decryptedFile = await encryption.aes256gcm.decryptBuffer(
    //       new Uint8Array(await response.data.arrayBuffer()),
    //       store.secret
    //     );

    //     const file = new File([decryptedFile], selectedNode.name, {
    //       type: selectedNode.mimeTypeRaw!,
    //     });

    //     //TODO: before you finish this finish absolutePath in backend first
    //     //TODO: different for text file read

    //     //TODO: move this in helper
    //     // const reader = new FileReader();
    //     // reader.onload = () => {
    //     //   textElement.textContent = reader.result as string;
    //     // };
    //     // reader.readAsText(file);

    //     // const fileName= decryptedFile.name.includes('.enc') ? decryptedFile.name.replace('.enc', '') : decryptedFile.name,
    //     // saveFile({
    //     //   bytes: decryptedFile,
    //     //   fileName: file.name.includes('.enc') ? file.name.replace('.enc', '') : file.name,
    //     // });

    //     store.url = URL.createObjectURL(file);

    //     console.log(response);
    //     console.log(response.data);
    //     console.log(URL.createObjectURL(response.data));
    //     console.log('='.repeat(20));
    //     console.log(file);
    //     console.log(URL.createObjectURL(file));
    //     console.log('executing');

    //     // store.setText(textResponse.data);
    //   } catch (error) {
    //     console.error(error);
    //     store.clear();
    //   }
    // };

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
          <img src={store.url} alt="" />

          {store.isEncryptedViewActive ? (
            <DialogBody className="max-h-none flex flex-col">
              <div className="pb-5 flex justify-between">
                <div className="flex items-center">
                  <H3 className="font-extralight m-0 pl-3">
                    {selectedNode.title + (selectedNode?.fileExstensionRaw ?? '')}
                    {isInBin && ' - Bin'}
                  </H3>
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
                {selectedNode.path}
                <br />
                {selectedNode.absRelativePath}

                <FormGroup label="Secret message" labelInfo="(required)" className="select-none">
                  <InputGroup
                    className="min-w-96"
                    autoFocus
                    tabIndex={1}
                    inputClassName="select-text"
                    intent="none"
                    name="Secret"
                    value={store.secret}
                    onChange={e => store.setSecret(e.target.value)}
                  />

                  <Button
                    className="mt-5"
                    text="Decrypt"
                    //
                    // onClick={onDecrypt}
                  />
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
                    onClick={() => fileStructureApiService.downloadById(selectedNode.id)}
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
                    src={selectedNode.absRelativePath ?? ''}
                    alt="Image not loaded, sorry"
                  />
                )}

                {type === 'audio' && (
                  <div className="flex items-center">
                    <audio controls src={selectedNode.absRelativePath ?? ''} />
                  </div>
                )}

                {type === 'video' && (
                  <video
                    controls
                    src={selectedNode.absRelativePath ?? ''}
                    disablePictureInPicture
                  />
                )}

                {type === 'text' && (
                  <>
                    <div className="w-[900px]">
                      <TextFileEditor
                        hideNewInMenu
                        hideReplaceSwitch
                        disableTitleEdit
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

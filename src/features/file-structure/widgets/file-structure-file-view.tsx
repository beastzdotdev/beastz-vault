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
import { useCallback, useEffect, useMemo } from 'react';
import { RootFileStructure } from '../../../shared/model';
import { constants } from '../../../shared/constants';
import { differentiate } from '../../../shared/helper';
import { FileStructureApiService, api } from '../../../shared/api';
import { ioc } from '../../../shared/ioc';
import { encryption } from '../../../shared/encryption';

type Params = {
  selectedNode: RootFileStructure;
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
  isInBin: boolean;
  binFsPath?: string;
};

export const FileStructureFileView = observer(
  ({ selectedNode, isOpen, toggleIsOpen, isInBin, binFsPath }: Params) => {
    const store = useLocalObservable(() => ({
      type: differentiate(selectedNode.mimeType),
      text: '',
      toggleBreak: false,
      secret: '',
      isEncryptedViewActive: selectedNode.isEncrypted,

      //temp
      url: '',

      setText(text: string) {
        this.text = text;
      },

      setSecret(secret: string) {
        this.secret = secret;
      },

      setIsEncryptedViewActive(value: boolean) {
        this.isEncryptedViewActive = value;
      },

      setToggleBreak(value: boolean) {
        this.toggleBreak = value;
      },

      clear() {
        this.text = '';
        this.toggleBreak = false;
        this.secret = '';
        this.isEncryptedViewActive = false;
      },
    }));

    const onDecrypt = async () => {
      try {
        const url = getFileUrl.replace(constants.path.backend.url, '');
        const response = await api.get<Blob>(url, { responseType: 'blob' });

        const decryptedFile = await encryption.aes256gcm.decryptBuffer(
          new Uint8Array(await response.data.arrayBuffer()),
          store.secret
        );

        const file = new File([decryptedFile], selectedNode.name, {
          type: selectedNode.mimeTypeRaw!,
        });

        //TODO: before you finish this finish absolutePath in backend first
        //TODO: different for text file read

        //TODO: move this in helper
        // const reader = new FileReader();
        // reader.onload = () => {
        //   textElement.textContent = reader.result as string;
        // };
        // reader.readAsText(file);

        // const fileName= decryptedFile.name.includes('.enc') ? decryptedFile.name.replace('.enc', '') : decryptedFile.name,
        // saveFile({
        //   bytes: decryptedFile,
        //   fileName: file.name.includes('.enc') ? file.name.replace('.enc', '') : file.name,
        // });

        store.url = URL.createObjectURL(file);

        console.log(response);
        console.log(response.data);
        console.log(URL.createObjectURL(response.data));
        console.log('='.repeat(20));
        console.log(file);
        console.log(URL.createObjectURL(file));
        console.log('executing');

        // store.setText(textResponse.data);
      } catch (error) {
        console.error(error);
        store.clear();
      }
    };

    const getFileUrl = useMemo(() => {
      const location = isInBin ? '/user-bin' : '/user-content';
      const path = isInBin ? binFsPath : selectedNode.path;

      return constants.path.backend.url + location + path;
    }, [binFsPath, isInBin, selectedNode.path]);

    const getText = useCallback(async () => {
      if (store.type === 'text') {
        try {
          const url = getFileUrl.replace(constants.path.backend.url, '');
          const textResponse = await api.get(url, { responseType: 'text' });

          console.log(textResponse.data);
          console.log('executing');

          store.setText(textResponse.data);
        } catch (error) {
          console.error(error);
          store.clear();
        }
      }
    }, [getFileUrl, store]);

    useEffect(() => {
      getText();
    }, [getText, selectedNode.isEncrypted]);

    return (
      <>
        <Dialog
          isOpen={isOpen}
          onClose={() => toggleIsOpen(false)}
          canOutsideClickClose
          canEscapeKeyClose
          shouldReturnFocusOnClose
          transitionDuration={0}
          enforceFocus
          className="shadow-none fixed top-0 left-0 bottom-0 m-0 right-0 w-full h-full !bg-transparent overflow-hidden select-none"
        >
          <img src={store.url} alt="" />

          {store.isEncryptedViewActive ? (
            <>
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
                    if (store.type === 'image' || store.type === 'other') {
                      toggleIsOpen(false);
                    }
                  }}
                >
                  {selectedNode.path}
                  <br />
                  {getFileUrl}

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

                    <Button className="mt-5" text="Decrypt" onClick={onDecrypt} />
                  </FormGroup>
                </div>
              </DialogBody>
            </>
          ) : (
            <>
              <DialogBody className="max-h-none flex flex-col">
                <div className="pb-5 flex justify-between">
                  <div className="flex items-center">
                    <H3 className="font-extralight m-0 pl-3">
                      {selectedNode.title + (selectedNode?.fileExstensionRaw ?? '')}
                      {isInBin && ' - Bin'}
                    </H3>
                  </div>

                  <div>
                    {store.type === 'image' && (
                      <Button
                        outlined
                        className="rounded-full mr-4"
                        icon="print"
                        onClick={() => window.print()}
                      >
                        Print
                      </Button>
                    )}
                    {store.type === 'text' && (
                      <Button
                        outlined
                        className="rounded-full mr-4"
                        icon="double-chevron-left"
                        onClick={() => store.setToggleBreak(!store.toggleBreak)}
                      >
                        Toggle break
                      </Button>
                    )}
                    <Button
                      outlined
                      className="rounded-full mr-4"
                      icon="download"
                      onClick={() => {
                        ioc
                          .getContainer()
                          .get(FileStructureApiService)
                          .downloadById(selectedNode.id);
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      icon="link"
                      className="rounded-full mr-2"
                      outlined
                      onClick={() => window.open(getFileUrl, '_blank')}
                    />
                    <Button
                      icon="cross"
                      className="rounded-full"
                      outlined
                      onClick={() => toggleIsOpen(false)}
                    />
                  </div>
                </div>

                <div
                  className="flex-1 overflow-hidden flex justify-center"
                  onClick={() => {
                    if (store.type === 'image' || store.type === 'other') {
                      toggleIsOpen(false);
                    }
                  }}
                >
                  {/* Start */}

                  {store.type === 'other' && (
                    <>
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
                              onClick={() => window.open(getFileUrl, '_blank')}
                            >
                              Open
                            </Button>
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
                    </>
                  )}

                  {store.type === 'image' && (
                    <>
                      <img
                        id="focused-for-print"
                        style={{
                          objectFit: 'contain',
                          maxWidth: '100%',
                          maxHeight: '100%',
                          aspectRatio: '16 / 9',
                        }}
                        src={getFileUrl}
                        alt="Image not loaded, sorry"
                      />
                    </>
                  )}

                  {store.type === 'audio' && (
                    <>
                      <div className="flex items-center">
                        <audio controls src={getFileUrl} />
                      </div>
                    </>
                  )}

                  {store.type === 'video' && (
                    <>
                      <video controls src={getFileUrl} disablePictureInPicture />
                    </>
                  )}

                  {store.type === 'text' && (
                    <>
                      <div className="xl:w-[75%] lg:w-[85%] w-[100%]  bg-[#1e1e1e] text-[#d4d4d4] p-3 select-text overflow-y-autow">
                        {store.text?.split('\n').map((line, index) => (
                          <div className={store.toggleBreak ? 'break-all' : ''} key={index}>
                            {line}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* End */}
                </div>
              </DialogBody>
            </>
          )}
        </Dialog>
      </>
    );
  }
);

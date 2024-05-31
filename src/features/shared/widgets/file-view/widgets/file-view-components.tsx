import { Button, Icon, NonIdealState, NonIdealStateIconSize } from '@blueprintjs/core';
import { useEffect } from 'react';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { openLink } from '../../../../../shared/helper';
import { RootFileStructure } from '../../../../../shared/model';
import { TextFileEditor } from '../../../../../widgets/text-editor';
import { FileViewController } from '../file-view.controller';
import { FileViewStore } from '../file-view-store';

export const FileViewNonIdealState = ({ item }: { item: RootFileStructure }) => (
  <NonIdealState
    title="Sorry, file type not supported"
    className="custom-non-ideal-state"
    layout="horizontal"
    iconMuted={false}
    description={
      <div>
        <p>Try opening using link button (support will be added soon)</p>

        <Button
          outlined
          className="rounded-full mt-4"
          icon="link"
          onClick={() => openLink(item.absRelativePath)}
          text="Open"
        />
      </div>
    }
    icon={<Icon icon="issue" size={NonIdealStateIconSize.STANDARD} className="text-neutral-50" />}
  />
);

export const FileViewImg = ({ item }: { item: RootFileStructure }) => {
  if (!item.absRelativePath) {
    return <></>;
  }

  return (
    <>
      <img
        id="focused-for-print"
        src={item.absRelativePath}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          objectPosition: 'center',
          maxWidth: '100%',
          maxHeight: '80%',
          aspectRatio: '16 / 9',
        }}
        crossOrigin="use-credentials"
        alt="Image not loaded, sorry"
      />
    </>
  );
};

export const FileViewAudio = ({ item }: { item: RootFileStructure }) => {
  if (!item.absRelativePath) {
    return <></>;
  }

  return (
    <div className="w-[500px]">
      <audio controls src={item.absRelativePath} style={{ width: '100%' }} />
    </div>
  );
};

export const FileViewVideo = ({ item }: { item: RootFileStructure }) => {
  if (!item.absRelativePath) {
    return <></>;
  }

  return (
    <video
      className="max-w-2xl h-auto"
      controls
      controlsList="nodownload noplaybackrate"
      src={item.absRelativePath}
      disablePictureInPicture
    />
  );
};

export const FileViewText = observer(({ item }: { item: RootFileStructure }) => {
  const fileViewController = useInjection(FileViewController);
  const fileViewStore = useInjection(FileViewStore);

  useEffect(
    () => {
      fileViewController.setTextInitial(item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="w-[900px]">
      <TextFileEditor
        hideNewInMenu
        hideReplaceSwitch
        disableTitleEdit
        hideFooter={fileViewStore.isTextReadonly || fileViewStore.isInBin}
        readOnly={fileViewStore.isTextReadonly || fileViewStore.isInBin}
        title={item?.title}
        text={fileViewStore.text}
        textSaveLoading={fileViewStore.textSaveLoading}
        onSave={({ text }) => fileViewController.saveText(item, text)}
        onClose={() => fileViewStore.setIsModalOpen(false)}
      />
    </div>
  );
});

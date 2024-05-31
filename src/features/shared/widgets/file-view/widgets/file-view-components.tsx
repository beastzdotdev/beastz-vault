import { Button, H2, Icon, NonIdealState, NonIdealStateIconSize } from '@blueprintjs/core';
import { openLink } from '../../../../../shared/helper';
import { RootFileStructure } from '../../../../../shared/model';

export const FileViewNonIdealState = ({ item }: { item: RootFileStructure }) => (
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

export const FileViewText = ({ item }: { item: RootFileStructure }) => {
  return (
    <div className="w-[900px]">
      <p>text {item.title}</p>
      {/* <TextFileEditor
        hideNewInMenu
        hideReplaceSwitch
        disableTitleEdit
        hideFooter={textStore.forceShowText || isInBin}
        readOnly={textStore.forceShowText || isInBin}
        title={item?.title}
        text={textStore.text}
        loading={textStore.loading}
        onSave={async ({ text }) => {
          console.log(text === textStore.text);

          if (text === textStore.text) {
            return;
          }

          textStore.setLoading(true);

          const startTime = new Date(); // Start time
          const { data, error } = await fileStructureApiService.replaceTextById(item.id, {
            text,
          });
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
      /> */}
    </div>
  );
};

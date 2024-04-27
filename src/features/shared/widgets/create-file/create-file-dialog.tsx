import { Suspense, lazy, useCallback, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Prec, keymap, ReactCodeMirrorRef, basicSetup } from '@uiw/react-codemirror';
import { indentLess, insertNewlineKeepIndent, insertTab } from '@codemirror/commands';
import {
  Button,
  Dialog,
  EditableText,
  Menu,
  MenuDivider,
  MenuItem,
  Switch,
} from '@blueprintjs/core';

import { useInjection } from 'inversify-react';
import { MenuPopover } from '../../../../components/menu-popover';
import { FileStructureApiService } from '../../../../shared/api';
import { getFileStructureUrlParams } from '../../helper/get-url-params';
import { cleanFiles, validateFileSize } from '../../helper/validate-file';
import { toast } from '../../../../shared/ui';
import { SharedController } from '../../state/shared.controller';

const CodeMirrorLay = lazy(() => import('@uiw/react-codemirror'));

type Params = {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
};

const highestPredesenceKeymapExtensions = Prec.highest(
  keymap.of([
    {
      key: 'Tab',
      preventDefault: true,
      run: insertTab,
    },
    {
      key: 'Shift-Tab',
      preventDefault: true,
      run: indentLess,
    },
    {
      key: 'Enter',
      preventDefault: true,
      run: insertNewlineKeepIndent,
    },

    // for future settings pages
    // return insertNewlineKeepIndent({ state, dispatch });
    // return insertNewline({ state, dispatch });
  ])
);

export const CreateFileDialog = observer(({ isOpen, toggleIsOpen }: Params) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const fileStructureApiService = useInjection(FileStructureApiService);
  const sharedController = useInjection(SharedController);

  const store = useLocalObservable(() => ({
    text: '',
    title: '',
    loading: false,
    replace: false,

    get isDisabled() {
      return this.text === '' || this.title === '';
    },

    setText(text: string) {
      this.text = text;
    },

    setTitle(title: string) {
      this.title = title;
    },

    setLoading(value: boolean) {
      this.loading = value;
    },

    setReplace(value: boolean) {
      this.replace = value;
    },

    clear() {
      this.text = '';
      this.title = '';
      this.loading = false;
      this.replace = false;
    },
  }));

  const menuItems = (
    <>
      <MenuPopover
        menuChildren={
          <>
            <MenuItem text="New" label="⌘C" />
            <MenuItem text="Open..." />

            <MenuDivider className="mx-1" />

            <MenuItem text="Close" />
            <MenuItem text="Save" />
            <MenuItem text="Save as..." />

            <MenuDivider className="mx-1" />

            <MenuItem text="Gorilla doc (coming soon)" disabled />
          </>
        }
      >
        <Button text="New" small minimal />
      </MenuPopover>

      <MenuPopover
        menuChildren={
          <Menu small>
            <MenuItem text="Wrap text" />
          </Menu>
        }
      >
        <Button text="Format" small minimal />
      </MenuPopover>
    </>
  );

  const saveFile = useCallback(async () => {
    store.setLoading(true);

    const { parentId, rootParentId } = getFileStructureUrlParams();
    const file = new File([store.text], store.title, { type: 'text/plain' });

    if (!validateFileSize([file])) {
      store.setLoading(false);
      return;
    }

    const sanitizedFiles = cleanFiles([file]);

    if (!sanitizedFiles.length) {
      store.setLoading(false);
      return;
    }

    if (!store.replace) {
      const { data: duplicateData, error } = await fileStructureApiService.getDuplicateStatus({
        titles: sanitizedFiles.map(() => file.name),
        isFile: true,
        parentId,
      });

      if (error) {
        toast.error(error?.message || 'Sorry, something went wrong');
        store.setLoading(false);
        return;
      }

      if (duplicateData?.find(e => e.title === file.name)?.hasDuplicate) {
        toast.showDefaultMessage('Diplicate name detected, please use another one');
        store.setLoading(false);
        return;
      }
    }

    const { data, error: uploadError } = await fileStructureApiService.uploadFile({
      file: file,
      keepBoth: !store.replace,
      parentId,
      rootParentId,
    });

    if (uploadError) {
      toast.error(uploadError?.message || 'Sorry, something went wrong');
      store.setLoading(false);
      return;
    }

    sharedController.createFileStructureInState(data!, store.replace);

    toggleIsOpen(false);
    store.clear();
  }, [fileStructureApiService, sharedController, store, toggleIsOpen]);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          store.clear();
          toggleIsOpen(false);
        }}
        canOutsideClickClose
        canEscapeKeyClose
        shouldReturnFocusOnClose
        transitionDuration={0}
        enforceFocus
        className="!shadow-none relative w-[900px]"
      >
        <div className="relative select-none">
          <div>{menuItems}</div>
          <div className="absolute left-1/2 -translate-x-1/2 top-0">
            <EditableText
              placeholder="Edit title..."
              multiline={false}
              minWidth={20}
              className="max-w-40"
              maxLength={256}
              value={store.title}
              onChange={store.setTitle}
            />
            {'.txt'}
          </div>
        </div>

        <Suspense fallback={<div className="w-full h-[800px]"></div>}>
          <CodeMirrorLay
            value={store.text}
            height="800px"
            theme={'dark'}
            ref={editorRef}
            spellCheck
            extensions={[basicSetup(), highestPredesenceKeymapExtensions]}
            onChange={value => store.setText(value)}
            basicSetup={{
              foldGutter: false,
              allowMultipleSelections: true,
              highlightActiveLine: true,
              lineNumbers: true,
              defaultKeymap: true,
            }}
          />
        </Suspense>

        <div className="p-3 flex justify-between select-none items-center">
          <Switch
            checked={store.replace}
            labelElement="Should replace"
            className="m-0"
            innerLabelChecked="on"
            innerLabel="off"
            onChange={e => store.setReplace(e.currentTarget.checked)}
          />
          <Button
            text="Save"
            loading={store.loading}
            disabled={store.isDisabled}
            className="px-5"
            onClick={saveFile}
          />
        </div>
      </Dialog>
    </>
  );
});

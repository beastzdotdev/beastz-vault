import { basicSetup } from 'codemirror';
import { Prec, keymap } from '@uiw/react-codemirror';
// import CodeMirror, { EditorView } from '@codemirror';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { Button, Dialog, EditableText, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import { Suspense, lazy, useRef } from 'react';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import {
  defaultKeymap,
  indentLess,
  insertNewlineKeepIndent,
  insertTab,
} from '@codemirror/commands';
import { MenuPopover } from '../../../../components/menu-popover';

const CodeMirrorLay = lazy(() => import('@uiw/react-codemirror'));

// minimalSetup({})

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

  const store = useLocalObservable(() => ({
    text: '',
    title: '',

    get isDisabled() {
      return this.text === '' || this.title === '';
    },

    setText(text: string) {
      this.text = text;
    },

    setTitle(title: string) {
      this.title = title;
    },

    clear() {
      this.text = '';
      this.title = '';
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
            // <CodeMirrorLay
            value={store.text}
            height="800px"
            theme={'dark'}
            spellCheck
            extensions={[basicSetup, highestPredesenceKeymapExtensions]}
            onChange={value => {
              store.setText(value);
            }}
            ref={editorRef}
            // onKeyDown={e => {
            //   if (e.key.toLowerCase() === 'tab') {
            //     e.preventDefault();
            //     handleTabKey();
            //   }
            // }}
            basicSetup={{
              foldGutter: false,
              allowMultipleSelections: true,
              highlightActiveLine: true,
              lineNumbers: true,
              //
              defaultKeymap: true,
            }}
          />
        </Suspense>

        <div className="p-3 flex justify-end">
          {JSON.stringify(store.title)}
          {JSON.stringify(store.text)}
          {JSON.stringify(store.isDisabled)}
          <Button text="Save" disabled={store.isDisabled} />
        </div>
      </Dialog>
    </>
  );
});

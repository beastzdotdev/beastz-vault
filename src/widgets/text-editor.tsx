import { MenuItem, Button, EditableText, Switch, Colors } from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { insertTab, indentLess, insertNewlineKeepIndent } from '@codemirror/commands';
import { Prec, keymap, basicSetup } from '@uiw/react-codemirror';
import { lazy, Suspense, useEffect } from 'react';
import { MenuPopover } from '../components/menu-popover';
import { download } from '../shared/helper';
import { toast } from '../shared/ui';

export type TextFileEditorOnSaveParams = {
  text: string;
  title: string;
  replace: boolean;
  realTitle: string;
};

export type Params = {
  text?: string;
  title?: string;
  replace?: boolean;
  textSaveLoading?: boolean;

  readOnly?: boolean;
  hideReplaceSwitch?: boolean;
  disableTitleEdit?: boolean;
  hideNewInMenu?: boolean;
  hideFooter?: boolean;

  onSave: (params: TextFileEditorOnSaveParams) => void;
  onClose: () => void;
};

const CodeMirrorLay = lazy(() => import('@uiw/react-codemirror'));

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
      run: ({ state, dispatch }) => {
        if (state.readOnly) {
          return false;
        }

        return insertNewlineKeepIndent({ state, dispatch });
      },
    },

    // for future settings pages
    // return insertNewlineKeepIndent({ state, dispatch });
    // return insertNewline({ state, dispatch });
  ])
);

export const TextFileEditor = observer((params: Params) => {
  const store = useLocalObservable(() => ({
    text: '',
    title: params?.title ?? '',
    replace: params?.replace ?? false,

    get isDisabled() {
      return this.text === '' || this.title === '';
    },

    get realTitle() {
      return this.title + '.txt';
    },

    get isTitleEmpty() {
      return this.title === '';
    },

    get isTextEmpty() {
      return this.text === '';
    },

    setText(text: string) {
      this.text = text;
    },

    setTitle(title: string) {
      this.title = title;
    },

    setReplace(value: boolean) {
      this.replace = value;
    },

    clear() {
      this.text = '';
      this.title = '';
      this.replace = false;
    },
  }));

  const saveLocaly = () => {
    runInAction(() => {
      if (store.isTextEmpty) {
        toast.showDefaultMessage('Nothing to save');
        return;
      }

      const title = store.isTitleEmpty ? 'example.txt' : store.realTitle;

      download(new File([store.text], title, { type: 'text/plain' }), title);
    });
  };

  useEffect(() => {
    if (params?.text) {
      store.setText(params.text);
    }
  }, [params.text, store]);

  const currentMenuItems = (
    <MenuPopover
      menuChildren={
        <>
          {!params.hideNewInMenu && <MenuItem text="New" onClick={() => store.clear()} />}
          <MenuItem text="Close" onClick={() => params?.onClose()} />
          <MenuItem text="Save" onClick={() => saveLocaly()} />
        </>
      }
    >
      <Button text="File" small minimal />
    </MenuPopover>
  );

  return (
    <div style={{ background: Colors.DARK_GRAY2 }}>
      <div className="relative select-none">
        <div>{currentMenuItems}</div>
        <div className="absolute left-1/2 -translate-x-1/2 top-0">
          {params.disableTitleEdit ? (
            store.realTitle
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <Suspense fallback={<div className="w-full h-[800px]"></div>}>
        <CodeMirrorLay
          value={store.text}
          height="800px"
          theme={'dark'}
          spellCheck
          readOnly={params.readOnly}
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

      {!params.hideFooter && (
        <div
          className={`p-3 flex select-none items-center ${
            params?.hideReplaceSwitch ? 'justify-end' : 'justify-between'
          }`}
        >
          {!params.hideReplaceSwitch && (
            <Switch
              checked={store.replace}
              labelElement="Should replace"
              className="m-0"
              innerLabelChecked="on"
              innerLabel="off"
              onChange={e => store.setReplace(e.currentTarget.checked)}
            />
          )}
          <Button
            text="Save"
            loading={params?.textSaveLoading}
            disabled={store.isDisabled}
            className="px-5"
            onClick={() =>
              runInAction(() => {
                params.onSave({
                  realTitle: store.realTitle,
                  text: store.text,
                  title: store.title,
                  replace: store.replace,
                });
              })
            }
          />
        </div>
      )}
    </div>
  );
});

//TODO in future
// const menuItems = (
//   <>
//     <MenuPopover
//       menuChildren={
//         <>
//           <MenuItem text="New" label="⌘C" />
//           <MenuItem text="Open..." />

//           <MenuDivider className="mx-1" />

//           <MenuItem text="Close" />
//           <MenuItem text="Save" />
//           <MenuItem text="Save as..." />

//           <MenuDivider className="mx-1" />

//           <MenuItem text="beastz-vault doc (coming soon)" disabled />
//         </>
//       }
//     >
//       <Button text="File" small minimal />
//     </MenuPopover>

//     <MenuPopover
//       menuChildren={
//         <Menu small>
//           <MenuItem text="Wrap text" />
//         </Menu>
//       }
//     >
//       <Button text="Format" small minimal />
//     </MenuPopover>
//   </>
// );

import CodeMirror from '@uiw/react-codemirror';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  Button,
  Dialog,
  EditableText,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
} from '@blueprintjs/core';

type Params = {
  isOpen: boolean;
  toggleIsOpen: (value: boolean) => void;
};

export const CreateFileDialog = observer(({ isOpen, toggleIsOpen }: Params) => {
  const store = useLocalObservable(() => ({
    text: '',
    title: '',

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
      <Popover
        placement="bottom-start"
        transitionDuration={0}
        content={
          <Menu small>
            <MenuItem text="New" />
            <MenuItem text="Open..." />

            <MenuDivider />

            <MenuItem text="Close" />
            <MenuItem text="Save" />
            <MenuItem text="Save as..." />

            <MenuDivider />

            <MenuItem text="Gorilla doc (coming soon)" disabled />
          </Menu>
        }
      >
        <Button text="New" small minimal />
      </Popover>

      <Popover
        placement="bottom-start"
        transitionDuration={0}
        content={
          <Menu small>
            <MenuItem text="Wrap text" />
          </Menu>
        }
      >
        <Button text="Format" small minimal />
      </Popover>
    </>
  );

  console.log('rerender');

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

        <CodeMirror
          value={store.text}
          height="800px"
          theme={'dark'}
          spellCheck
          onChange={value => store.setText(value)}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            allowMultipleSelections: true,
            highlightActiveLine: true,
          }}
        />

        <div className="p-3 flex justify-end">
          <Button text="Save" />
        </div>
      </Dialog>
    </>
  );
});

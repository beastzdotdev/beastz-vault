import { useRef, useEffect, useState } from 'react';
import { EditorState, Prec } from '@codemirror/state';
import {
  EditorView,
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';
import {
  defaultKeymap,
  indentLess,
  insertNewlineKeepIndent,
  insertTab,
} from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';

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

    // return insertNewlineKeepIndent({ state, dispatch });
    // return insertNewline({ state, dispatch });
  ])
);

export const Editor = () => {
  const editor = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<EditorView>();
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!editor.current) {
      return;
    }

    const onUpdate = EditorView.updateListener.of(v => {
      console.log(v);

      setCode(v.state.doc.toString());
    });

    const startState = EditorState.create({
      doc: 'Hello World',
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        oneDark,
        EditorState.tabSize.of(2),

        // keymaps
        keymap.of(defaultKeymap),
        highestPredesenceKeymapExtensions,

        // update listener
        onUpdate,
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editor.current,
    });

    setView(view);

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <>
      {code}
      <br />
      {view?.state.doc.toString()}
      <div
        onClick={() => view?.focus()}
        style={{
          maxHeight: 400,
          height: 400,
          backgroundColor: '#292C33',
          border: '1px solid rgba(94, 94, 94, 0.48)',
          userSelect: 'auto',
          cursor: 'auto',
        }}
        ref={editor}
      />
    </>
  );
};

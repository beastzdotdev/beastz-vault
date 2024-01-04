import { v4 as uuid } from 'uuid';
import { Button, Icon } from '@blueprintjs/core';
import { useReducer } from 'react';

interface FileStuructureFileItemParams {
  title: string;
  userName: string;
  date: string;
  fileSize: string;
  isFile: boolean;
  isSelected: boolean;
  onSelected: (id: string) => void;
  id: string;
}

const FileStuructureFileItem = (params: FileStuructureFileItemParams): React.JSX.Element => {
  return (
    <div
      className={`gorilla-file-structure-item group/gorilla-item ${
        params.isSelected ? 'gorilla-file-structure-item-selected' : ''
      }`}
      onClick={() => params.onSelected(params.id)}
    >
      {/*//! width 100px behaves like min-width:100px */}
      <div className="flex items-center pl-3 pr-5 flex-grow w-[100px]">
        <Icon icon={params.isFile ? 'document' : 'folder-close'} />
        <p className="pl-2 truncate">{params.title}</p>
      </div>

      <div className="flex flex-grow-0 py-1">
        <div className="flex items-center justify-start w-[200px] pr-5">
          <Icon icon="user" />
          {/* TODO add tooltip */}
          <p className="truncate max-w-[170px] block pl-2">{params.userName}</p>
        </div>

        <div className="flex items-center justify-start w-[200px] pr-5">
          <p>{params.date}</p>
        </div>

        <div className="flex items-center justify-start w-[90px] pr-5">
          <p>{params.fileSize}</p>
        </div>
      </div>

      <div className="flex items-center justify-end flex-grow-0 w-[210px]">
        <Button
          icon="share"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="bookmark"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="download"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="edit"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="lock"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        <Button
          icon="shield"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
          onClick={e => e.stopPropagation()}
        />
        {/* TODO add dropdown for more items */}
        <Button icon="more" minimal />
      </div>
    </div>
  );
};

type F_ACTION = {
  type: 'TOGGLE_SELECTED_ALL_EXCEPT_THIS';
  payload: { id: string };
};

type F = Omit<FileStuructureFileItemParams, 'onSelected'>;

function reducer(state: F[], action: F_ACTION) {
  switch (action.type) {
    case 'TOGGLE_SELECTED_ALL_EXCEPT_THIS':
      return state.map(e => {
        e.isSelected = e.id === action.payload.id;
        return e;
      });
    default:
      break;
  }

  return state;
}

const initialState: F[] = [
  {
    id: uuid(),
    title: 'Shared',
    userName: 'Me',
    date: '20 march 2016',
    fileSize: '100 gb',
    isFile: false,
    isSelected: false,
  },
  {
    id: uuid(),
    title: 'Something from my memories',
    userName: 'BukaNika69',
    date: '11 november 1995',
    fileSize: '11 bytes',
    isFile: false,
    isSelected: false,
  },
  {
    id: uuid(),
    title:
      'Something from my memories extra looooooooooong looooooooooong looooooooooong looooooooooong looooooooooong',
    userName: 'BukaNika69from my memories extra looooooooooong',
    date: '31 September 1995',
    fileSize: '1119 bytes',
    isFile: true,
    isSelected: false,
  },
];

export const FileStructureFiles = (): React.JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="gorilla-file-structure">
      {state.map(e => {
        return (
          <FileStuructureFileItem
            id={e.id}
            key={e.id}
            title={e.title}
            userName={e.userName}
            date={e.date}
            fileSize={e.fileSize}
            isFile={e.isFile}
            isSelected={e.isSelected}
            onSelected={id => {
              dispatch({
                type: 'TOGGLE_SELECTED_ALL_EXCEPT_THIS',
                payload: { id: e.id },
              });

              console.log('selected' + id);
            }}
          />
        );
      })}
    </div>
  );
};

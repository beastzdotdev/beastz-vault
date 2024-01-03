import { Button, Icon } from '@blueprintjs/core';

const FileStuructureFileItem = (params: {
  title: string;
  userName: string;
  date: string;
  fileSize: string;
}): React.JSX.Element => {
  //TODO add selected items and on top layer actions for thos files/folders
  //TODO different icon for file and folder add isFolder property or enum

  return (
    <div className="gorilla-file-structure-item group/gorilla-item">
      {/*//! width 100px behaves like min-width:100px */}
      <div className="flex items-center pl-3 pr-5 flex-grow w-[100px]">
        <Icon icon="folder-close" />
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
        />
        <Button
          icon="bookmark"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
        />
        <Button
          icon="download"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
        />
        <Button
          icon="edit"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
        />
        <Button
          icon="lock"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
        />
        <Button
          icon="shield"
          minimal
          className="transition-all duration-100 ease-linear opacity-0 group-hover/gorilla-item:opacity-100"
        />
        {/* TODO add dropdown for more items */}
        <Button icon="more" minimal />
      </div>
    </div>
  );
};

export const FileStructureFiles = (): React.JSX.Element => {
  return (
    <div className="gorilla-file-structure">
      <FileStuructureFileItem
        title={'Shared'}
        userName={'Me'}
        date={'20 march 2016'}
        fileSize={'100 gb'}
      />

      <FileStuructureFileItem
        title={'Something from my memories'}
        userName={'BukaNika69'}
        date={'11 november 1995'}
        fileSize={'11 bytes'}
      />

      <FileStuructureFileItem
        title={
          'Something from my memories extra looooooooooong looooooooooong looooooooooong looooooooooong looooooooooong'
        }
        userName={'BukaNika69from my memories extra looooooooooong'}
        date={'31 September 1995'}
        fileSize={'1119 bytes'}
      />
    </div>
  );
};

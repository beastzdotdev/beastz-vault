import filenamify from 'filenamify/browser';
import { H3, CardList, Card } from '@blueprintjs/core';
import { bus } from '../../../shared/bus';
import { constants } from '../../../shared/constants';
import { formatSize } from '../../../shared/helper';

export const validateFileSize = (files: FileList | null): files is FileList => {
  if (!files?.length) {
    return false;
  }

  if (files?.length > constants.MAX_FILE_COUNT) {
    bus.emit('show-alert', {
      message: `Too many files ${files.length} (max ${constants.MAX_FILE_COUNT}), sorry this application is relatively small and not meant to handle so many file (reason: each file has limit of ${constants.MAX_FILE_UPLOAD_SIZE_IN_MB}mb memory so if you decide to upload max amount of files app would need more than 4.5gb of memory)`,
    });

    return false;
  }

  return true;
};

export const cleanFiles = (files: FileList): File[] => {
  const sanitizedFiles: File[] = [];
  const ignoredFiles: (
    | { name: string; reason: 'name' }
    | { size: string; name: string; reason: 'size' }
  )[] = [];

  for (const file of files) {
    if (file.name !== filenamify(file.name)) {
      ignoredFiles.push({
        name: file.name,
        reason: 'name',
      });
    } else if (file.size > constants.MAX_FILE_UPLOAD_SIZE_BYTES) {
      ignoredFiles.push({
        name: file.name,
        size: formatSize(file.size),
        reason: 'size',
      });
    } else {
      sanitizedFiles.push(file);
    }
  }

  // show message for error of size limit
  if (ignoredFiles.length) {
    bus.emit('show-alert', {
      message: (
        <>
          <H3>Warning, This files will be ignored</H3>
          <br />

          <CardList compact className="whitespace-nowrap max-h-64" bordered={false}>
            {ignoredFiles.map((e, i) => {
              if (e.reason === 'size') {
                return (
                  <Card className="flex justify-between" key={i}>
                    <p>{e.name}</p>
                    <p className="ml-3 text-red-500">{e.size}</p>
                  </Card>
                );
              }

              if (e.reason === 'name') {
                return (
                  <Card className="flex justify-between" key={i}>
                    <p>{e.name}</p>
                    <p className="ml-3 text-red-500">Invalid name</p>
                  </Card>
                );
              }
            })}
          </CardList>
        </>
      ),
    });
  }

  return sanitizedFiles;
};

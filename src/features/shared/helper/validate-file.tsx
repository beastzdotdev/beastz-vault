import { H3, CardList, Card } from '@blueprintjs/core';
import { constants, bus, formatFileSize } from '../../../shared';

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

  const fileSizeLimitMessages: { size: string; name: string }[] = [];

  // check size first
  for (const file of files) {
    if (file.size > constants.MAX_FILE_UPLOAD_SIZE) {
      fileSizeLimitMessages.push({
        name: file.name,
        size: formatFileSize(file.size),
      });
    }
  }

  // show message for error of size limit
  if (fileSizeLimitMessages.length) {
    bus.emit('show-alert', {
      message: (
        <>
          <H3>This files exceed size limit(~{constants.MAX_FILE_UPLOAD_SIZE_IN_MB}mb)</H3>
          <br />

          <CardList compact className="whitespace-nowrap max-h-64">
            {fileSizeLimitMessages.map(e => (
              <Card className="flex justify-between">
                <p>{e.name}</p>
                <p className="ml-3">{e.size}</p>
              </Card>
            ))}
          </CardList>
        </>
      ),
    });

    return false;
  }

  return true;
};

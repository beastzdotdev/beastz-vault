export const getFileStructureUrlParams = (url?: string) => {
  const urlObj = new URL(url ?? window.location.href);
  const tempRootParentId = urlObj.searchParams.get('root_parent_id');
  const tempParentId = urlObj.searchParams.get('id');
  const tempFolderPath = urlObj.searchParams.get('path');

  return {
    isRoot: tempRootParentId === 'root',
    rootParentId: tempRootParentId ? parseInt(tempRootParentId) : undefined,
    parentId: tempParentId && tempParentId !== 'root' ? parseInt(tempParentId) : undefined,
    folderPath: tempFolderPath ? decodeURIComponent(tempFolderPath) : undefined,
  };
};

export const getFsUrlParamsLite = () => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');

  return {
    isRoot: id === 'root',
    id: id && id !== 'root' ? parseInt(id) : null,
  };
};

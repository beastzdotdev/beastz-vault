export const getFileStructureUrlParams = () => {
  const urlObj = new URL(window.location.href);
  const tempRootParentId = urlObj.searchParams.get('root_parent_id');
  const tempParentId = urlObj.searchParams.get('id');
  const tempFolderPath = urlObj.searchParams.get('path');

  return {
    rootParentId: tempRootParentId ? parseInt(tempRootParentId) : undefined,
    parentId: tempParentId && tempParentId !== 'root' ? parseInt(tempParentId) : undefined,
    folderPath: tempFolderPath ? decodeURIComponent(tempFolderPath) : undefined,
  };
};

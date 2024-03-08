export const getFileStructureUrlParams = () => {
  const urlObj = new URL(window.location.href);
  const tempRootParentId = urlObj.searchParams.get('root_parent_id');
  const tempParentId = urlObj.searchParams.get('id');

  const rootParentId = tempRootParentId ? parseInt(tempRootParentId) : undefined;
  const parentId = tempParentId && tempParentId !== 'root' ? parseInt(tempParentId) : undefined;

  return {
    rootParentId,
    parentId,
  };
};

import { BasicFileStructureInRootDto } from '../shared';

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

/**
 * @description Reason for this here is very simple, blueprint tree does not take any type other than TreeNodeInfo
 * and i do not wanted to map every BasicFileStructureInRootDto into TreeNodeInfo which would have cause
 * lot of perfomance issues (on recursively creating new object) so I just took TreeNodeInfo as is and
 * just declared it again as bellow.
 * Finally because TreeNodeInfo is no longer "pure" it was aliased as RootFS (Root file structure)
 *
 * Better example for perfomance would be to just add additional parameter (e.g. BasicFileStructureInRootDto)
 * to existing object (e.g. TreeNodeInfo) rather than creating new one and allocating more memory
 */
declare module '@blueprintjs/core/lib/esm/components/tree/treeTypes' {
  interface TreeNodeInfo extends BasicFileStructureInRootDto {}
  export type RootFS = TreeNodeInfo;
}

/**
 * ///TODO this needs ground up refactor here is list what we can do
 *
 * move to new branch this will take time sidebar-tree-refactor
 *
 * first we need to move BasicFileStructureInRootDto into BasicFSInRoot because it is used in sidebar
 * inside shared store (declared up)
 *
 * then fix all errors which will be caused by this moving
 *
 * then move all code from sidebar.tsx into shared store (e.g. remove reducer completely)
 * because its causing a lot of problems like state management, router problems
 */

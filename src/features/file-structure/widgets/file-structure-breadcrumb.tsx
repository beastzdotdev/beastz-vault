import { Breadcrumbs } from '@blueprintjs/core';
import { constants } from '../../../shared/constants';

//TODO finish
export const FileStructureBreadcrumb = (): React.JSX.Element => {
  return (
    <Breadcrumbs
      className="max-w-sm"
      items={[{ icon: 'cloud', text: 'Vault', href: constants.path.fileStructure }]}
    />
  );
};

// import { Breadcrumbs, BreadcrumbProps } from '@blueprintjs/core';
// import { useInjection } from 'inversify-react';
// import { observer } from 'mobx-react-lite';
// import { useCallback } from 'react';
// import { constants } from '../../../shared/constants';
// import { SharedController } from '../../shared/state/shared.controller';
// import { SharedStore } from '../../shared/state/shared.store';

// export const FileStructureBreadcrumb = observer((): React.JSX.Element => {
//   const sharedStore = useInjection(SharedStore);
//   const sharedController = useInjection(SharedController);

//   const onBreadCrumbClick = useCallback(
//     (e: React.MouseEvent, link: string) => {
//       console.log(e);
//       console.log(link);

//       e.preventDefault(); // do not refresh

//       // Push to history
//       sharedController.pushToHistory(link);
//     },

//     [sharedController]
//   );

//   if (sharedStore.activeId === 'root') {
//     // do not add href because no need to redirect on root if already on root
//     return <Breadcrumbs className="max-w-sm" items={[{ icon: 'cloud', text: 'cloud' }]} />;
//   }

//   return (
//     <>
//       <Breadcrumbs
//         className="max-w-sm select-none text-nowrap"
//         items={(
//           sharedStore.searchNodeAndParents(
//             sharedStore.activeRootFileStructure,
//             sharedStore.activeId
//           ) ?? []
//         )
//           ?.filter(Boolean)
//           ?.reduce<BreadcrumbProps[]>((acc, node, i, arr) => {
//             const isLast = i === arr?.length - 1;

//             if (i === 0) {
//               // This here represents root and here href is needed
//               acc.push({
//                 icon: 'cloud',
//                 text: 'cloud',
//                 href: constants.path.fileStructure,
//               });
//             }

//             // This here represents each node parent and node iteslf
//             acc.push({
//               onClick: e => onBreadCrumbClick(e, node.link!),
//               icon: 'folder-close',
//               text: node.name,
//               ...(!isLast && { href: node.link }), // add href except for last (e.g. itself)
//             });

//             return acc;
//           }, [])}
//       />
//     </>
//   );
// });

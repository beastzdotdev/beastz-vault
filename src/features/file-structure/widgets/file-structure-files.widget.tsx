import { Button, Intent, NonIdealState, NonIdealStateIconSize } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { SharedStore } from '../../shared/state/shared.store';
import { useNavigate } from 'react-router-dom';
import { FileStuructureFileItem } from './file-structure-item.widget';

export const FileStructureFilesWidget = observer((): React.JSX.Element => {
  const sharedStore = useInjection(SharedStore);
  const navigate = useNavigate();

  return (
    <div className="gorilla-file-structure">
      {sharedStore.activeFileStructureInBody.length ? (
        sharedStore.activeFileStructureInBody.map(e => {
          return (
            <FileStuructureFileItem
              {...e}
              userName="Me"
              key={e.id}
              onSelected={id => sharedStore.setIsSelectedInActiveFSPage(id)}
              onDoubleClick={value => {
                const { id, isFile, rootParentId } = value;

                if (isFile) {
                  //TODO do stuff for file
                  return;
                }

                const redirectUrlObj = new URL(window.location.href);
                redirectUrlObj.searchParams.set('id', id.toString());
                redirectUrlObj.searchParams.set(
                  'root_parent_id',
                  rootParentId ? rootParentId.toString() : id.toString()
                );
                redirectUrlObj.searchParams.set('path', encodeURIComponent(e.path));

                navigate(redirectUrlObj.pathname + redirectUrlObj.search);
              }}
            />
          );
        })
      ) : (
        <NonIdealState
          className="mt-16"
          title="No folder found"
          icon="search"
          description="Looks like there were no folder or files found in this directory"
          action={
            <Button onClick={() => navigate(-1)} intent={Intent.PRIMARY} minimal outlined>
              Go back
            </Button>
          }
          iconSize={NonIdealStateIconSize.STANDARD}
        />
      )}
    </div>
  );
});

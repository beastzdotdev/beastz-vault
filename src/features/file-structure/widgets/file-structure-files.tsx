import { Button, Intent, NonIdealState, NonIdealStateIconSize } from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useNavigate } from 'react-router-dom';
import { FileStuructureFileItem } from '../../../widgets/file-structure-item.widget';
import { SharedController } from '../../shared/state/shared.controller';
import { SafeRenderArray } from '../../../components/safe-render-array';
import { getQueryParams } from '../../../shared/helper';
import { FSQueryParams, selectFileStructure } from '../file-structure.loader';

export const FileStructureFiles = observer((): React.JSX.Element => {
  const sharedController = useInjection(SharedController);
  const navigate = useNavigate();

  const localSelectedStore = useLocalObservable(() => ({
    selected: new Set<number>(),

    setSelectedSingle(id: number) {
      if (this.selected.size === 1 && this.selected.has(id)) {
        return;
      }

      this.selected.clear();
      this.selected.add(id);
    },
    setSelectedMultiple(id: number) {
      if (this.selected.has(id)) {
        this.selected.delete(id);
      } else {
        this.selected.add(id);
      }
    },
    clear() {
      this.selected.clear();
    },
  }));

  return (
    <div className="gorilla-file-structure">
      <SafeRenderArray
        data={sharedController.findFolderNodeForActiveBody()}
        renderChild={node => {
          return (
            <FileStuructureFileItem
              isSelected={localSelectedStore.selected.has(node.id)}
              key={node.id}
              node={node}
              onSelected={node => {
                localSelectedStore.setSelectedSingle(node.id);
              }}
              onDoubleClick={async node => {
                if (!node.isFile) {
                  if (!node.link) {
                    return;
                  }

                  // Push to history
                  sharedController.pushToHistory(node.link);

                  // Select corresponding file in file structure item
                  const url = new URL('http://localhost:5173' + node.link);
                  const query: FSQueryParams = getQueryParams<FSQueryParams>(url.toString());
                  selectFileStructure(url, query);
                } else {
                  //TODO show file
                }
              }}
            />
          );
        }}
        renderError={() => {
          return (
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
          );
        }}
      />
    </div>
  );
});

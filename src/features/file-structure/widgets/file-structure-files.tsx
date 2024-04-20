import { Button, Intent, NonIdealState, NonIdealStateIconSize } from '@blueprintjs/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FileStuructureFileItem } from '../../../widgets/file-structure-item.widget';
import { SafeRenderArray } from '../../../components/safe-render-array';
import { SharedStore } from '../../shared/state/shared.store';
import { FileStructureApiService } from '../../../shared/api';
import { toast } from '../../../shared/ui';
import { ChangeColor } from './change-color';
import { RootFileStructure } from '../../../shared/model';

export const FileStructureFiles = observer((): React.JSX.Element => {
  const fileStructureApiService = useInjection(FileStructureApiService);
  const sharedStore = useInjection(SharedStore);
  const navigate = useNavigate();

  const [isChangeColorOpen, setChangeColorOpen] = useState(false);

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

  const toggleOpen = (value: boolean, type: 'change-color') => {
    const finalValue = value;

    // is closing
    if (!finalValue) {
      localSelectedStore.clear();
    }

    switch (type) {
      case 'change-color':
        setChangeColorOpen(finalValue);
        break;
    }
  };

  return (
    <div className="gorilla-file-structure">
      <SafeRenderArray
        data={sharedStore.activeBodyFileStructure}
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
                if (node.isFile) {
                  //TODO show file
                  return;
                }

                navigate(node.link);
              }}
              onMoveToBin={async node => {
                await fileStructureApiService.moveToBin(node.id);
                window.location.reload(); //TODO no need for refresh just refresh state not browser page
              }}
              onCopy={node => {
                navigator.clipboard.writeText(node.title);
                toast.showMessage('Copied to clipboard');
              }}
              onColorChange={() => {
                toggleOpen(true, 'change-color');
              }}
            />
          );
        }}
        renderError={() => {
          if (sharedStore.activeRootFileStructure.length === 0) {
            return (
              <NonIdealState
                className="mt-16"
                title="Come on do something"
                icon="projects"
                iconMuted={false}
                description="Click on sidebar item new and choose action"
                iconSize={NonIdealStateIconSize.STANDARD}
              />
            );
          }

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

      <ChangeColor
        selectedIds={[...localSelectedStore.selected]}
        isOpen={isChangeColorOpen}
        toggleIsOpen={() => toggleOpen(!isChangeColorOpen, 'change-color')}
      />
    </div>
  );
});

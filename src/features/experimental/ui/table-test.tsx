import { ControlGroup, Classes, Button, Intent, H5, Popover } from '@blueprintjs/core';
import { JSX } from 'react';
import { Table2, Column, Cell, ColumnHeaderCell, SelectionModes } from '@blueprintjs/table';

const PopoverConfirm = (params: { onSuccessClick: () => void }) => {
  return (
    <div key="text">
      <H5>Confirm deletion</H5>
      <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
        <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button
          intent={Intent.DANGER}
          className={Classes.POPOVER_DISMISS}
          onClick={params.onSuccessClick}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

const PopConfirm = (params: { onSuccessClick: () => void }) => {
  return (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      portalClassName="foo"
      enforceFocus={false}
      content={<PopoverConfirm onSuccessClick={params.onSuccessClick} />}
    >
      <Button intent={Intent.DANGER} tabIndex={0} small icon="delete" />
    </Popover>
  );
};

export const TableTest = (): JSX.Element => {
  const ColumnHeader = (index: number) => {
    return (
      <ColumnHeaderCell
        name={'hello'}
        index={index}
        nameRenderer={(name, _index) => (
          <div style={{ lineHeight: '24px' }}>
            <div className={Classes.TEXT_LARGE}>
              <strong>{name}</strong>
            </div>
          </div>
        )}
      />
    );
  };

  return (
    <>
      <ControlGroup fill={true} vertical={true} style={{ width: '500px' }}>
        <div style={{ height: '400px' }}>
          <Table2
            numRows={10}
            enableGhostCells={true}
            enableFocusedCell={false}
            minRowHeight={100}
            defaultRowHeight={40}
            selectionModes={SelectionModes.NONE}
          >
            <Column
              cellRenderer={rowIndex => <Cell>{'hello' + rowIndex ?? ''}</Cell>}
              columnHeaderCellRenderer={ColumnHeader}
            />
            <Column
              cellRenderer={rowIndex => <Cell>{10 + rowIndex ?? ''}</Cell>}
              columnHeaderCellRenderer={ColumnHeader}
            />
            <Column
              cellRenderer={rowIndex => (
                <Cell intent={Intent.NONE} tooltip={'asdasd'}>
                  <PopConfirm
                    onSuccessClick={() => {
                      console.log('='.repeat(20));
                      console.log('deleting row with index ' + rowIndex);
                    }}
                  />
                </Cell>
              )}
              columnHeaderCellRenderer={index => (
                <ColumnHeaderCell
                  name="Action"
                  index={index}
                  nameRenderer={(name, _index) => (
                    <div style={{ lineHeight: '24px' }}>
                      <div className={Classes.TEXT_LARGE}>
                        <strong>{name}</strong>
                      </div>
                    </div>
                  )}
                />
              )}
            />
          </Table2>
        </div>
      </ControlGroup>
    </>
  );
};

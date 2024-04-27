import { FileStructureTopBar } from './widgets/file-structure-topbar';
import { FileStructureFiles } from './widgets/file-structure-files';
import { FileStructureBreadcrumb } from './widgets/file-structure-breadcrumb';

// const typeItems: AdvancedSelectItem[] = [
//   { key: uuid(), text: 'Images' },
//   { key: uuid(), text: 'Pdfs' },
//   { key: uuid(), text: 'Videos' },
//   { key: uuid(), text: 'Audios' },
//   { key: uuid(), text: 'Shortcuts' },
//   { key: uuid(), text: 'Folders' },
//   { key: uuid(), text: 'Files' },
//   { key: uuid(), text: 'Archives (zip)' },
// ];

// const modifiedItems: AdvancedSelectItem[] = [
//   { key: uuid(), text: 'Today' },
//   { key: uuid(), text: 'Last 7 days' },
//   { key: uuid(), text: 'Last 30days' },
//   { key: uuid(), text: 'This year' },
//   { key: uuid(), text: 'Last year' },
//   { key: uuid(), text: 'Custom' },
// ];

export const FileStructurePage = (): React.JSX.Element => {
  // const [selectedType, setSelectedType] = useState<AdvancedSelectItem | null>(null);
  // const [modifiedType, setModifiedType] = useState<AdvancedSelectItem | null>(null);

  return (
    <>
      <FileStructureTopBar />

      <div className="overflow-y-auto">
        <div className="p-3">
          <FileStructureBreadcrumb />

          <div className="w-full flex pt-3">
            {/* <AdvancedSelect
              className="min-w-[90px]"
              items={typeItems}
              value={selectedType}
              placeholder="Type"
              handleSelect={value => setSelectedType(value)}
            />

            <AdvancedSelect
              className="ml-3 min-w-[120px]"
              items={modifiedItems}
              value={modifiedType}
              placeholder="Modified"
              handleSelect={value => setModifiedType(value)}
            /> */}

            {/* <AdvancedSelect
              className="ml-3 min-w-[100px]"
              items={peopleItems}
              value={person}
              placeholder="Person"
              onFilter={value => setPersonTerm(value)}
              handleSelect={value => setPerson(value)}
              onSearch={_value => {
                console.log('='.repeat(20));
                console.log('Searched value');
              }}
            /> */}
          </div>

          <div className="pt-3">
            <FileStructureFiles />
          </div>
        </div>
      </div>
    </>
  );
};

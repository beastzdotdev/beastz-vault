import { Button } from "@blueprintjs/core";
import { FileStructureSearchBar } from "./file-structure-search-bar";
import { openLink } from "../../../shared/helper";
import { constants } from "../../../shared/constants";

export const FileStructureTopBar = (): React.JSX.Element => {
  return (
    <>
      <div className="flex justify-between p-3">
        <FileStructureSearchBar />

        <div className="whitespace-nowrap">
          <Button
            icon="book"
            intent="success"
            onClick={() => openLink(constants.external.document.home)}
          />
        </div>
      </div>
    </>
  );
};

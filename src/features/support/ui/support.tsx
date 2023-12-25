import { Button, Classes, H2, Icon, Intent } from '@blueprintjs/core';
import { router } from '../../../router';
import { constants } from '../../../shared';

//TODO support page
export const Support = (): React.JSX.Element => {
  return (
    <div className="w-fit mx-auto mt-20">
      <div className="flex items-center">
        <Icon icon={'build'} size={35} intent={Intent.WARNING} />
        <H2 className="m-0 ml-3">Sorry this page is under construction</H2>
      </div>

      <br />
      <div className="flex justify-center">
        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button
            icon="link"
            text="Redirect"
            intent={Intent.PRIMARY}
            onClick={() => router.navigate(constants.path.signIn)}
          />
        </div>
      </div>
    </div>
  );
};

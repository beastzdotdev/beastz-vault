import { Button, Classes, H2, Icon, Intent } from '@blueprintjs/core';
import { router } from '../../router';
import { constants } from '../../shared/constants';

export const AuthUserBlockedPage = (): React.JSX.Element => {
  return (
    <div className="w-fit mx-auto mt-20">
      <div className="flex items-center">
        <Icon icon={'blocked-person'} size={35} intent={Intent.DANGER} />
        <H2 className="m-0 ml-3">
          Your account has been blocked, please contact support for more information
        </H2>
      </div>

      <br />
      <div className="flex justify-center">
        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button
            icon="link"
            text="Redirect"
            intent={Intent.PRIMARY}
            onClick={() => router.navigate(constants.path.support)}
          />
        </div>
      </div>
    </div>
  );
};

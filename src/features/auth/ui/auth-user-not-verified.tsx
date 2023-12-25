import { Button, Classes, H2, Icon, Intent } from '@blueprintjs/core';
import { router } from '../../../router';
import { constants } from '../../../shared';

export const AuthUserNotVerified = (): React.JSX.Element => {
  return (
    <>
      <div className="w-fit mx-auto mt-20">
        <div className="flex items-center">
          <Icon icon={'blocked-person'} size={35} intent={Intent.DANGER} />
          <H2 className="m-0 ml-3">Your account is not verified, please verify you account</H2>
        </div>

        <br />
        <div className="flex justify-center">
          <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
            <Button
              icon="badge"
              text="Verify"
              intent={Intent.PRIMARY}
              onClick={() => router.navigate(constants.path.authVerify)}
            />
            <Button
              icon="log-in"
              text="Sign in"
              intent={Intent.NONE}
              className="ml-2"
              onClick={() => router.navigate(constants.path.signIn)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

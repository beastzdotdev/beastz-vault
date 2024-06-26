import { Button, Classes, H2, Icon, Intent } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { constants } from '../../shared/constants';

export const AuthUserNotVerifiedPage = (): React.JSX.Element => {
  const navigate = useNavigate();

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
              onClick={() => navigate(constants.path.authVerify)}
            />
            <Button
              icon="log-in"
              text="Sign in"
              intent={Intent.NONE}
              className="ml-2"
              onClick={() => navigate(constants.path.signIn)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

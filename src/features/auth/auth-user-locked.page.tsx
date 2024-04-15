import { Button, Classes, H2, Icon, Intent } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { constants } from '../../shared/constants';

export const AuthUserLockedPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="w-fit mx-auto mt-20">
      <div className="flex items-center">
        <Icon icon={'shield'} size={35} intent={Intent.DANGER} />
        <H2 className="m-0 ml-3">
          Your account has been locked due to some suspicious activity, please verify account again
          to use our application
        </H2>
      </div>

      <br />
      <div className="flex justify-center">
        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button
            icon="link"
            text="Redirect"
            intent={Intent.PRIMARY}
            onClick={() => navigate(constants.path.authVerify)}
          />
        </div>
      </div>
    </div>
  );
};

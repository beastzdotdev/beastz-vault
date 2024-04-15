import { Button, Classes, H2, Icon, Intent } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { constants } from '../../shared/constants';

export const AuthRecoverPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();

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
            onClick={() => navigate(constants.path.signIn)}
          />
        </div>
      </div>
    </div>
  );
};

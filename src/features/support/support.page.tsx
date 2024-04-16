import { Button, Classes, H2, Icon, Intent } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';

export const SupportPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="w-fit mx-auto pt-20">
      <div className="flex items-center">
        <Icon icon={'build'} size={35} intent={Intent.WARNING} />
        <H2 className="m-0 ml-3">Sorry this page is under construction</H2>
      </div>

      <div>
        <a href="mailto:wildstackdev@gmail.com">Send email if you have further question</a>
      </div>

      <br />
      <div className="flex justify-center">
        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button
            icon="link"
            text="Go Home"
            intent={Intent.PRIMARY}
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    </div>
  );
};

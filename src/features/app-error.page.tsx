import { Button, Classes, H2, Icon, Intent } from '@blueprintjs/core';
import { useRouteError } from 'react-router-dom';
import { router } from '../router';

export const AppErrorPage = (): React.JSX.Element => {
  const error = useRouteError();

  return (
    <>
      <div className="w-fit mx-auto mt-20">
        <div className="flex items-center">
          <Icon icon={'error'} size={50} intent={Intent.DANGER} />
          <H2 className="m-0 ml-3">
            {error instanceof Error && error.message.trim()
              ? error.message.trim()
              : 'Oops, sorry this was unexpected'}
          </H2>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button
            icon="link"
            text="Go Home"
            intent={Intent.NONE}
            onClick={() => router.navigate('/')}
          />
        </div>
      </div>
    </>
  );
};

import { Button, H2, Icon, Intent } from '@blueprintjs/core';
import { NavLink, useRouteError } from 'react-router-dom';
import { router } from '../../../router';

export const ErrorPage = (): React.JSX.Element => {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <div id="error-page">
        <h1>Oops! Unexpected Error</h1>
        <p>Something went wrong.</p>
        <p>
          <i>{error.message}</i>
        </p>
        <NavLink to="/">
          <Button text="Go Back" intent={Intent.PRIMARY} />
        </NavLink>
      </div>
    );
  }

  return (
    <div className="w-fit mx-auto mt-20">
      <div className="flex items-center justify-center">
        <Icon icon={'issue'} size={35} intent={Intent.WARNING} />
        <H2 className="m-0 ml-3">Oops! sorry, page not found.</H2>
      </div>

      {/* Go back with -1 */}
      <div className="flex justify-center mt-5">
        <Button text="Go Back" intent={Intent.WARNING} onClick={() => router.navigate(-1)} />
      </div>
    </div>
  );
};

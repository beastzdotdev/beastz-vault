import { Button, Intent } from '@blueprintjs/core';
import { useRouteError } from 'react-router-dom';
import { router } from '../../router';

export const ErrorPage = (): React.JSX.Element => {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <div className="w-fit mx-auto mt-20">
        <div className="flex flex-col items-center justify-center">
          <p className="m-0 ml-3 text-3xl">Something unexpected happend</p>
          {error.message && <p className="m-0 ml-3 text-lg bp5-text-muted">{error.message}</p>}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            minimal
            outlined
            text="Go Home"
            intent={Intent.WARNING}
            onClick={() => router.navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit mx-auto mt-20">
      <div className="flex items-center justify-center">
        <p className="m-0 ml-3 text-8xl">Page not found</p>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          minimal
          outlined
          text="Go Home"
          intent={Intent.WARNING}
          onClick={() => router.navigate('/')}
        />
      </div>
    </div>
  );
};

import { Button, Intent } from '@blueprintjs/core';
import { NavLink, isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      // ...
    } else if (error.status === 404) {
      // ...
    }

    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText}</i>
        </p>
        <NavLink to="/">
          <Button text="Go Back" intent={Intent.PRIMARY} />
        </NavLink>
      </div>
    );
  }

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
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <NavLink to="/">
        <Button text="Go Back" intent={Intent.PRIMARY} />
      </NavLink>
    </div>
  );
}

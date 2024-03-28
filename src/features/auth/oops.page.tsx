import { H2, Icon, Intent } from '@blueprintjs/core';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { constants } from '../../shared';

export const OopsPage = (): React.JSX.Element => {
  const location = useLocation();
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const optionalText = queryParams.get('text');

    setText(optionalText ?? null);
  }, [location.search]);

  return (
    <div className="w-fit mx-auto mt-20">
      <div className="flex items-center">
        <Icon icon={'error'} size={35} intent={Intent.DANGER} />
        <H2 className="m-0 ml-3">{text ?? 'Oops, sorry this was unexpected'}</H2>
      </div>

      <div className="flex justify-end">
        <p className="mt-2 ml-auto bp5-text-muted">
          Please contact our{' '}
          <Link to={constants.path.support} className="font-bold">
            Support
          </Link>{' '}
          if you ended up on this page. Go
          <Link to="/" className="font-bold">
            {' '}
            Home
          </Link>
        </p>
      </div>
    </div>
  );
};

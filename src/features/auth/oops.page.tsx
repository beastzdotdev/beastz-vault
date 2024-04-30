import { H2, Icon, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { constants } from '../../shared/constants';
import { apiPure } from '../../shared/api';

export const errNetworkText = 'Network Error';

export const OopsPage = (): React.JSX.Element => {
  const [text, setText] = useState<string | null>(null);

  const healthCheck = useCallback(async () => {
    let redirect = true;

    try {
      await apiPure.get('health');
    } catch (error) {
      const e = error as AxiosError;

      const isNetworkError = [
        AxiosError.ERR_NETWORK,
        AxiosError.ERR_CANCELED,
        AxiosError.ECONNABORTED,
        AxiosError.ETIMEDOUT,
      ].includes(e?.code ?? '');

      redirect = !isNetworkError;
    }

    if (redirect) {
      window.location.href = '/';
    }
  }, []);

  useEffect(
    () => {
      const queryParams = new URLSearchParams(location.search);
      const optionalText = queryParams.get('text');

      setText(optionalText ?? null);

      if (optionalText?.toLowerCase() === errNetworkText.toLowerCase()) {
        // do health check so if user refreshes and network is up again redriect back to root page
        healthCheck();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="w-fit mx-auto pt-20">
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

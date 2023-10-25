import { H2, Icon, Intent } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { constants } from '../../../shared/constants';

export const Oops = (): React.JSX.Element => {
  return (
    <div className="w-fit mx-auto mt-20">
      <div className="flex items-center">
        <Icon icon={'error'} size={35} intent={Intent.DANGER} />
        <H2 className="m-0 ml-3">Oops, sorry this was unexpected,</H2>
      </div>

      <div className="flex justify-end">
        <p className="mt-2 ml-auto bp5-text-muted">
          Please contact our{' '}
          <Link to={constants.path.support} className="font-bold">
            Support
          </Link>{' '}
          if you ended up on this page.
        </p>
      </div>
    </div>
  );
};

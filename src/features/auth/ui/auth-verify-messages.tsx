import { H2, Icon, Intent } from '@blueprintjs/core';
import React from 'react';

export const AuthVerifyMessage = (): React.JSX.Element => {
  return (
    <div className="flex items-center w-fit mx-auto mt-20">
      <Icon icon={'envelope'} size={35} intent={Intent.SUCCESS} />
      <H2 className="m-0 ml-3">We have sent you account verification on you email</H2>
    </div>
  );
};

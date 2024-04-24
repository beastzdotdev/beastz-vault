import { Button, Callout, CompoundTag, H2, H4, H5, Icon } from '@blueprintjs/core';
import { TEXT_MUTED } from '@blueprintjs/core/lib/esm/common/classes';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { UserSupportStore } from './state/user-support.store';
import { getTagIntentForSupport } from './user-support.helper';
import { constants } from '../../shared/constants';

export const UserSupportTicketDetailPage = observer((): React.JSX.Element => {
  const userSupportStore = useInjection(UserSupportStore);
  const navigate = useNavigate();

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <Button icon="plus" outlined className="float-button" />

      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <Button icon="chevron-left" minimal onClick={() => navigate(constants.path.support)} />
          </div>
          <H2 className="font-extralight mb-1">Ticket review</H2>
          <CompoundTag
            intent={getTagIntentForSupport(userSupportStore.singleData.status)}
            children={userSupportStore.singleData.status}
            leftContent={'Status'}
            className="ml-3"
            minimal
          />
        </div>
        B
      </div>

      <H5 className={`${TEXT_MUTED} font-extralight`}>{userSupportStore.singleData.uuid}</H5>

      <br />
      <br />

      <div className="flex flex-col">
        <div className="flex justify-center">
          <H4 className="truncate max-w-[700px]">{userSupportStore.singleData.title}</H4>
        </div>

        <div className="flex justify-center">
          <Callout compact intent="none" className="max-w-[700px] max-h-52 overflow-y-auto">
            {userSupportStore.singleData.description.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </Callout>
        </div>
      </div>
    </div>
  );
});

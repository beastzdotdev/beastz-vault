import { Button, Callout, CompoundTag, H2, H4, H5, Tag } from '@blueprintjs/core';
import { TEXT_MUTED } from '@blueprintjs/core/lib/esm/common/classes';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserSupportStore } from './state/user-support.store';
import { getTagIntentForSupport } from './user-support.helper';
import { constants } from '../../shared/constants';
import { UserSupportMessageModal } from './widget/user-support-message-modal';
import { PopConfirmCustom } from '../../components/pop-confirm-custom';

export const UserSupportTicketDetailPage = observer((): React.JSX.Element => {
  const userSupportStore = useInjection(UserSupportStore);
  const navigate = useNavigate();
  const [isUserSupportMessageModelOpen, setUserSupportMessageModelOpen] = useState(false);

  return (
    <div className="px-2.5 pt-3 cursor-default">
      <Button
        icon="plus"
        outlined
        className="float-button"
        onClick={() => setUserSupportMessageModelOpen(true)}
      />

      <UserSupportMessageModal
        isOpen={isUserSupportMessageModelOpen}
        toggleIsOpen={setUserSupportMessageModelOpen}
      />

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

      <div className="flex items-center">
        <H5 className={`${TEXT_MUTED} font-extralight m-0`}>{userSupportStore.singleData.uuid}</H5>

        <PopConfirmCustom
          text="Hello, fellow user, please keep in mind that here only first 100 messages is loaded."
          title="Information"
          doNotShowButton
        >
          <Button outlined small intent="primary" icon="high-priority" className="ml-3" />
        </PopConfirmCustom>
      </div>

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

      <div className="mt-10 max-h-[550px] overflow-y-auto">
        {userSupportStore.messages.map(e => {
          const supportImg = e.userSupportImages?.[0];

          return (
            <Callout
              key={e.id}
              compact
              intent="none"
              className={`max-w-[700px] max-h-auto break-words mt-5 ${
                e.fromAdmin ? 'ml-auto' : ''
              }`}
            >
              {e.fromAdmin && <Tag intent={'primary'} children={'From admin'} minimal />}

              <div className={`${e.fromAdmin ? 'mt-3' : ''}`}>{e.text}</div>

              {supportImg !== undefined && (
                <>
                  <img
                    style={{
                      objectFit: 'cover',
                      maxWidth: '500px',
                      aspectRatio: '16 / 9',
                    }}
                    alt="Image not loaded, sorry"
                    src={constants.path.backend.url + '/hub' + supportImg.path}
                    className="mt-3"
                  />
                </>
              )}
            </Callout>
          );
        })}
      </div>
    </div>
  );
});

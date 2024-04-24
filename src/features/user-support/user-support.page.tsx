import {
  Button,
  Card,
  CardList,
  CompoundTag,
  H2,
  NonIdealState,
  NonIdealStateIconSize,
  Section,
  SectionCard,
} from '@blueprintjs/core';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { constants } from '../../shared/constants';
import { getTagIntentForSupport } from './user-support.helper';
import { UserSupportStore } from './state/user-support.store';
import { UserSupportTicketStatus } from '../../shared/enum';
import { UserSupportController } from './state/user-support.controller';
import { PopConfirmCustom } from '../../components/pop-confirm-custom';

export const UserSupportPage = observer((): React.JSX.Element => {
  const navigate = useNavigate();
  const userSupportStore = useInjection(UserSupportStore);
  const userSupportController = useInjection(UserSupportController);

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <H2 className="font-extralight">Support</H2>

      <Section
        title="Active tickets"
        compact={false}
        className="mt-8"
        rightElement={
          <>
            <PopConfirmCustom
              text="Hello, fellow user, please keep in mind that here only first 100 support ticket is loaded."
              title="Information"
              doNotShowButton
            >
              <Button outlined intent="primary" icon="info-sign" />
            </PopConfirmCustom>
            <Button
              outlined
              intent="primary"
              icon="plus"
              onClick={() => navigate(constants.path.supportTicketCreate)}
            />

            <PopConfirmCustom
              text="Are you sure you want to delete all tickets? You won't be able to recover them"
              onSuccessClick={() => userSupportController.deleteAll()}
            >
              <Button outlined intent="danger" icon="delete" text="Delete all" />
            </PopConfirmCustom>
          </>
        }
      >
        <SectionCard padded={false}>
          <CardList compact className="max-h-[316px]">
            {userSupportStore.isEmpty ? (
              <NonIdealState
                className="my-10"
                title="No ticket found"
                icon="search"
                layout="horizontal"
                iconMuted={false}
                description="Looks like there were no ticket created"
                iconSize={NonIdealStateIconSize.STANDARD}
              />
            ) : (
              userSupportStore.data.map(ticket => (
                <Card
                  interactive={false}
                  className="flex justify-between whitespace-nowrap"
                  key={ticket.id}
                >
                  <Link to={constants.path.support + `/${ticket.id}`}>
                    <div
                      className={`truncate max-w-[500px] ${
                        ticket.status === UserSupportTicketStatus.IGNORED ? 'opacity-70' : ''
                      }`}
                    >
                      {ticket.title}
                    </div>
                  </Link>

                  <div>
                    <CompoundTag
                      intent={getTagIntentForSupport(ticket.status)}
                      children={ticket.status}
                      leftContent={'Status'}
                      className="mr-3"
                    />

                    <PopConfirmCustom
                      isConfirm
                      text="Are you sure you want to resolve this ticket? You won't be able to reopen it."
                      title="Resolve ticket"
                      onSuccessClick={() => userSupportController.resolveTicket(ticket.id)}
                    >
                      <Button
                        disabled={
                          ticket.status === UserSupportTicketStatus.RESOLVED ||
                          ticket.status === UserSupportTicketStatus.IGNORED
                        }
                        outlined
                        intent="primary"
                        small
                        text="Resolve"
                        className="mr-3"
                      />
                    </PopConfirmCustom>

                    <PopConfirmCustom
                      onSuccessClick={(): void => {
                        userSupportController.deleteTicket(ticket.id);
                      }}
                    >
                      <Button outlined intent="danger" small text="Delete" />
                    </PopConfirmCustom>
                  </div>
                </Card>
              ))
            )}
          </CardList>
        </SectionCard>
      </Section>
    </div>
  );
});

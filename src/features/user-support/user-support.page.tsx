import {
  Button,
  Card,
  CardList,
  Classes,
  CompoundTag,
  H2,
  H5,
  Intent,
  Popover,
  Section,
  SectionCard,
} from '@blueprintjs/core';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { constants } from '../../shared/constants';

// use

const titles: {
  id: string;
  title: string;
  status: 'pending' | 'resolved' | 'ignored';
}[] = [
  {
    id: uuid(),
    status: 'resolved',
    title:
      'BasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasil',
  },
  { id: uuid(), status: 'pending', title: 'Olive oil' },
  { id: uuid(), status: 'pending', title: 'Kosher salt' },
  { id: uuid(), status: 'pending', title: 'Garlic' },
  { id: uuid(), status: 'pending', title: 'Pine nuts' },
  { id: uuid(), status: 'ignored', title: 'Parmigiano Reggiano' + uuid() },
  { id: uuid(), status: 'ignored', title: 'Parmigiano Reggiano' + uuid() },
  { id: uuid(), status: 'ignored', title: 'Parmigiano Reggiano' + uuid() },
  { id: uuid(), status: 'ignored', title: 'Parmigiano Reggiano' + uuid() },
  { id: uuid(), status: 'ignored', title: 'Parmigiano Reggiano' + uuid() },
  { id: uuid(), status: 'ignored', title: 'Parmigiano Reggiano' + uuid() },
  { id: uuid(), status: 'ignored', title: 'Parmigiano Reggiano' + uuid() },
];

function getIntent(status: 'pending' | 'resolved' | 'ignored'): Intent {
  switch (status) {
    case 'resolved':
      return 'success';
    case 'ignored':
      return 'warning';
    default:
      return 'primary';
  }
}

type Something<T> = { children: React.ReactNode; text?: string } & (T extends undefined
  ? { onSuccessClick: () => void; data?: T }
  : { onSuccessClick: (value: T) => void; data: T });

const PopConfirm = <T,>(params: Something<T>) => {
  return (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      portalClassName="foo"
      enforceFocus={false}
      content={
        <div key="text">
          <H5>Confirm deletion</H5>
          <p>
            {params?.text ??
              "Are you sure you want to delete these items? You won't be able to recover them."}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
            <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
              Cancel
            </Button>
            <Button
              intent={Intent.DANGER}
              className={Classes.POPOVER_DISMISS}
              onClick={() => (params.data ? params.onSuccessClick(params.data) : undefined)}
            >
              Delete
            </Button>
          </div>
        </div>
      }
    >
      {params.children}
    </Popover>
  );
};

export const UserSupportPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <H2 className="font-extralight">Support</H2>

      <Section
        title="Active tickets"
        compact={false}
        className="mt-8"
        rightElement={
          <>
            <Button
              outlined
              intent="primary"
              icon="plus"
              onClick={() => navigate(constants.path.supportTicketCreate)}
            />

            <PopConfirm
              data={undefined}
              children={
                <Button
                  outlined
                  intent="danger"
                  icon="delete"
                  onClick={() => console.log('delete all')}
                  text="Delete all"
                />
              }
              onSuccessClick={(): void => {}}
            />
          </>
        }
      >
        <SectionCard padded={false}>
          <CardList compact className="max-h-[316px]">
            {titles.map(e => (
              <Card interactive={false} className="flex justify-between" key={e.id}>
                <Link to={constants.path.support + `/${e.id}`}>
                  <span className="truncate w-96">{e.title}</span>
                </Link>

                <div>
                  <CompoundTag
                    intent={getIntent(e.status)}
                    children={e.status}
                    title="hihello"
                    leftContent={'Status'}
                    className="mr-3"
                  />

                  {e.status !== 'ignored' && (
                    <PopConfirm
                      data={e}
                      onSuccessClick={(obj): void => {
                        console.log('resolve', obj);
                        //TODO
                      }}
                    >
                      <Button outlined intent="primary" small text="Resolve" className="mr-3" />
                    </PopConfirm>
                  )}

                  <PopConfirm
                    data={e}
                    onSuccessClick={(obj): void => {
                      console.log('delete', obj);
                      //TODO
                    }}
                  >
                    <Button outlined intent="danger" small text="Delete" />
                  </PopConfirm>
                </div>
              </Card>
            ))}
          </CardList>
        </SectionCard>
      </Section>
    </div>
  );
};

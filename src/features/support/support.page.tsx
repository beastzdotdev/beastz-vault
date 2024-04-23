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

const PopConfirm = <T,>(params: {
  children: React.ReactNode;
  onSuccessClick: (value: T) => void;
  data: T;
}) => {
  return (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      portalClassName="foo"
      enforceFocus={false}
      content={
        <div key="text">
          <H5>Confirm deletion</H5>
          <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
            <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
              Cancel
            </Button>
            <Button
              intent={Intent.DANGER}
              className={Classes.POPOVER_DISMISS}
              onClick={() => params.onSuccessClick(params.data)}
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

export const SupportPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <div className="flex justify-between items-center">
        <H2 className="font-extralight">Support</H2>

        <Button
          icon="plus"
          intent="none"
          text="New ticket"
          onClick={() => navigate(constants.path.supportTicketCreate)}
        />
      </div>

      <Section title="Active tickets" compact className="mt-8">
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

      <Section title="Resolved tickets" compact className="mt-8">
        <SectionCard></SectionCard>
      </Section>
    </div>
  );
};

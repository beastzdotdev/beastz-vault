import { H2, H4, H5, Intent } from '@blueprintjs/core';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';
import { TEXT_MUTED } from '@blueprintjs/core/lib/esm/common/classes';

// use

const obj: {
  id: string;
  title: string;
  status: 'pending' | 'resolved' | 'ignored';
} = {
  id: uuid(),
  status: 'resolved',
  title:
    'BasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasilBasil',
};

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

export const SupportTicketCreatePage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // fetch based on id
    console.log(id);
  }, []);

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <H2 className="font-extralight mb-1">Ticket create</H2>
      {/* <H5 className={`${TEXT_MUTED} font-extralight`}>{id}</H5> */}

      {/* <br />
      <br />

      <div className="flex flex-col">
        <div className="flex justify-center">
          <H4 className="font-extralight truncate max-w-[700px]">{obj.title}</H4>
        </div>
      </div> */}
    </div>
  );
};

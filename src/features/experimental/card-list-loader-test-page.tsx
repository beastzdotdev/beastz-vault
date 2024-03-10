import { CardList, Card, Spinner } from '@blueprintjs/core';

export const CardListLoaderTestPage = () => {
  return (
    <CardList bordered={false} compact>
      <Card aria-label="somethin" interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
      <Card aria-label="somethin" interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
      <Card aria-label="somethin" interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
      <Card aria-label="somethin" interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
      <Card aria-label="somethin" interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
    </CardList>
  );
};

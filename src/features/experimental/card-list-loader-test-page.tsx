import { CardList, Card, Spinner } from '@blueprintjs/core';

export const CardListLoaderTestPage = () => {
  return (
    <CardList bordered={false} compact={true}>
      <Card interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
      <Card interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
      <Card interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
      <Card interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
      <Card interactive={false} className="flex justify-between">
        <p>Hello</p>
        <Spinner size={15} />
      </Card>
    </CardList>
  );
};

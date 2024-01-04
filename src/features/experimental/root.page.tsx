import { CardList, Card } from '@blueprintjs/core';
import { Link, Outlet } from 'react-router-dom';

export const ExperimentalRootPage = (): React.JSX.Element => {
  return (
    <>
      <div className="w-fit mx-auto mt-20">
        <CardList className="flex flex-row" compact>
          <Card>
            <Link to="/">Go back (Home)</Link>
          </Card>
          <Card>
            <Link to="/experimental">Root</Link>
          </Card>
          <Card>
            <Link to="/experimental/encryption">Encryption</Link>
          </Card>
          <Card>
            <Link to="/experimental/tree-node">Tree node</Link>
          </Card>
          <Card>
            <Link to="/experimental/table">Table</Link>
          </Card>
          <Card>
            <Link to="/experimental/test-refresh-flow">Test refresh flow</Link>
          </Card>
        </CardList>
      </div>

      <br />
      <hr />

      <div className="m-5">
        <Outlet />
      </div>
    </>
  );
};

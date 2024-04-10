import { observer } from 'mobx-react-lite';

type SafeRenderArrayProps<T> = {
  data: T[];
  renderChild: (item: T) => JSX.Element;
  renderError: () => JSX.Element;
};

export const SafeRenderArray = observer(<T,>(props: SafeRenderArrayProps<T>): JSX.Element => {
  const { data, renderChild, renderError } = props;

  if (!data?.length) {
    return <>{renderError()}</>;
  }

  return <>{data.map(e => renderChild(e))}</>;
});

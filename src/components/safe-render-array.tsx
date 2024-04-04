import { observer } from 'mobx-react-lite';

type SafeRenderArrayProps<T> = {
  data: T[];
  renderChild: (item: T) => JSX.Element;
  renderError: () => JSX.Element;
};

type SafeRenderChildProps<T> = Omit<SafeRenderArrayProps<T>, 'renderError'>;

export const SafeRenderChild = observer(<T,>(props: SafeRenderChildProps<T>): JSX.Element => {
  return <>{props.data.map(e => props.renderChild(e))}</>;
});

export const SafeRenderArray = <T,>(props: SafeRenderArrayProps<T>): JSX.Element => {
  const { data, renderChild, renderError } = props;

  if (!data?.length) {
    return <>{renderError()}</>;
  }

  return (
    <>
      <SafeRenderChild data={data} renderChild={renderChild} />
    </>
  );
};

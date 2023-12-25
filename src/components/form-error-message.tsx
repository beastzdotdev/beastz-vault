import { Text } from '@blueprintjs/core';

export const FormErrorMessage = (params: { message?: string }) => {
  if (!params?.message) {
    return <></>;
  }

  return (
    <>
      <Text style={{ color: '#e76a6e', paddingLeft: 10, paddingTop: 5 }}>{params.message}</Text>
    </>
  );
};

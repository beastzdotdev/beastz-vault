import { Text } from '@blueprintjs/core';

export const FormErrorMessage = ({ message }: { message: string | undefined }) => {
  if (!message) {
    return <></>;
  }

  return (
    <>
      <Text style={{ color: '#e76a6e', paddingLeft: 10, paddingTop: 5 }}>{message}</Text>
    </>
  );
};

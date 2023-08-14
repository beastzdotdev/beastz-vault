import { Button } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom';
import { constants } from '../common/constants';

export const Profile = () => {
  const navigate = useNavigate();

  const WebSignOut = async () => {
    try {
      // await signOut();
      navigate(constants.path.signIn);
    } catch (e: unknown) {
      // showErrorMessage(handleFirebaseError(e));
    }
  };

  return (
    <>
      <p>gio</p>

      {/* <p>email: {user?.email}</p>
      <p>displayName: {user?.displayName}</p>
      <p>uid: {user?.uid}</p>
      <p>emailVerified: {user?.emailVerified}</p>
      <p>photoURL: {user?.photoURL}</p> */}
      <br />
      <Button icon="log-out" intent="primary" text="Sign out" onClick={WebSignOut} />
    </>
  );
};

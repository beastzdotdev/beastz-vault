import { Suspense } from 'react';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

import { ProfileStore } from '../../profile/state/profile.store';
import { constants } from '../../../shared/constants';
import { DefaultLogo } from './default-logo';

export const ProfileIcon = observer(() => {
  const profileStore = useInjection(ProfileStore);

  return (
    <NavLink to={constants.path.profile} style={{ all: 'unset' }}>
      <div className="beastz-vault-profile flex items-center justify-between py-2 mx-1.5 mb-1 cursor-pointer">
        <div className="flex items-center">
          <Suspense>
            {profileStore.user.profileFullImagePath ? (
              <img
                src={profileStore.user.profileFullImagePath}
                width={24}
                height={24}
                alt="no profile img"
                className="rounded-full ml-1.5 border border-solid border-gray-500 border-opacity-50"
              />
            ) : (
              <DefaultLogo
                width={24}
                height={24}
                className="rounded-full ml-1.5 border border-solid border-gray-500 border-opacity-50"
                gender={profileStore.user.gender}
              />
            )}
          </Suspense>

          <p className="ml-2 font-medium no-underline">{profileStore.user.userName}</p>
        </div>
      </div>
    </NavLink>
  );
});

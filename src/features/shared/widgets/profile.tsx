import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ProfileStore } from '../../profile/state/profile.store';

export const ProfileIcon = observer(() => {
  const Logo = React.lazy(() => import('../../../assets/images/profile/doodle-man-1.svg?react'));
  const profileStore = useInjection(ProfileStore);

  return (
    <div className="flex items-center">
      <React.Suspense>
        {/* suspense will not be needed after adding cdn link for profile img */}
        <Logo width={24} height={24} className="rounded-sm ml-1.5" />
      </React.Suspense>

      <p className="ml-2 font-medium">{profileStore.user.userName}</p>
    </div>
  );
});

import { Button, ProgressBar } from '@blueprintjs/core';
import { useInjection } from 'inversify-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { constants } from '../../../../shared/constants';
import { formatSizeRaw, formatSize } from '../../../../shared/helper';
import { SharedStore } from '../../state/shared.store';

export const StorageLimitIndicator = observer(() => {
  const sharedStore = useInjection(SharedStore);
  const progressBarValue = computed(() => {
    return formatSizeRaw(sharedStore.generalInfo.totalSize) / constants.MAX_ALLOWED_FILE_SIZE_BYTES;
  });

  return (
    <>
      <NavLink to={constants.path.storage}>
        {params => <Button icon="cloud" text="Storage" active={params.isActive} />}
      </NavLink>

      {progressBarValue.get() >= 0.05 && (
        <ProgressBar
          // value less than 0.05 seems awfull, seems like empty space is just there
          value={progressBarValue.get()}
          animate={false}
          stripes={false}
          intent={'warning'}
          className="h-1 mb-1 mt-3 mx-2.5"
        />
      )}

      <p className="text-xs text-amber-400 text-muted mx-2.5 mt-1.5">
        {formatSize(sharedStore.generalInfo.totalSize) || 0} of{' '}
        {constants.MAX_ALLOWED_TOTAL_SIZE_IN_GB} Gb
      </p>
    </>
  );
});

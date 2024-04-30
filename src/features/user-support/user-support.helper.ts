import { Intent } from '@blueprintjs/core';
import { UserSupportTicketStatus } from '../../shared/enum';

export const getTagIntentForSupport = (status: UserSupportTicketStatus): Intent => {
  switch (status) {
    case UserSupportTicketStatus.RESOLVED:
      return 'success';
    case UserSupportTicketStatus.PENDING:
      return 'primary';
    case UserSupportTicketStatus.IGNORED:
    default:
      return 'warning';
  }
};

import { UserSupportTicketStatus } from '../../enum';

export class UserSupportDto {
  id: number;
  title: string;
  status: UserSupportTicketStatus;
  description: string;
  userId: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserSupportCreateDto {
  description: string;
  title: string;
}

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

export class UserSupportUpdateDto {
  description?: string;
  title?: string;
  status?: UserSupportTicketStatus;
}

export class UserSupportMessageCreateDto {
  file?: File;
  text: string;
}

export class UserSupportImageDto {
  id: number;
  path: string;
  createdAt: Date;
}

export class UserSupportMessageDto {
  id: number;
  userId: number;
  fromAdmin: boolean;
  text: string;
  userSupportId: number;
  createdAt: Date;
  userSupportImages: UserSupportImageDto[];
}

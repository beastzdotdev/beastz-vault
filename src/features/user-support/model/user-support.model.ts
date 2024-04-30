import { Type, plainToInstance } from 'class-transformer';
import { makeAutoObservable, runInAction } from 'mobx';
import { UserSupportDto } from '../../../shared/api/user-support/user-support.schema';
import { UserSupportTicketStatus } from '../../../shared/enum';

export class UserSupport implements UserSupportDto {
  constructor() {
    makeAutoObservable(this);
  }

  id: number;
  title: string;
  status: UserSupportTicketStatus;
  description: string;
  userId: number;
  uuid: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;

  static customTransform(data: UserSupportDto): UserSupport {
    return runInAction(() => {
      const newItem = plainToInstance(UserSupport, data);
      return newItem;
    });
  }
}

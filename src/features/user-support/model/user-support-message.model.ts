import { Type, plainToInstance } from 'class-transformer';
import { makeAutoObservable, runInAction } from 'mobx';
import {
  UserSupportImageDto,
  UserSupportMessageDto,
} from '../../../shared/api/user-support/user-support.schema';

export class UserSupportMessage implements UserSupportMessageDto {
  constructor() {
    makeAutoObservable(this);
  }

  id: number;
  userId: number;
  fromAdmin: boolean;
  text: string;
  userSupportId: number;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => UserSupportImage)
  userSupportImages: UserSupportImage[];

  static customTransform(data: UserSupportMessageDto): UserSupportMessage {
    return runInAction(() => {
      return plainToInstance(UserSupportMessage, data);
    });
  }
}

export class UserSupportImage implements UserSupportImageDto {
  id: number;
  path: string;

  @Type(() => Date)
  createdAt: Date;
}

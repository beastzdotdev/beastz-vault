import { inject } from 'inversify';
import { UserStore } from './user.store';
import { Singleton } from '../../../shared/decorators';
import { User } from '../../../entities/user';

@Singleton
export class UserController {
  @inject(UserStore)
  private readonly userStore: UserStore;

  async setUser(user: User) {
    this.userStore.setUser(user);
  }
}

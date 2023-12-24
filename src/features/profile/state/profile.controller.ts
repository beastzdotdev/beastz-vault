import { ProfileStore } from './profile.store';
import { User } from '../../../entities/user';
import { Inject, Singleton } from '../../../shared';

@Singleton
export class ProfileController {
  @Inject(ProfileStore)
  private readonly profileStore: ProfileStore;

  async setUser(user: User) {
    this.profileStore.setUser(user);
  }
}

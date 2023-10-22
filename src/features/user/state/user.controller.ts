import { inject } from 'inversify';
import { UserApiService } from '../../../shared/api/user/user-api';
import { Singleton } from '../../../shared/ioc';
import { UserStore } from './user.store';
import { ExceptionMessageCode } from '../../../models/enum/exception-message-code.enum';
import { router } from '../../../router';
import { constants } from '../../../shared/constants';

@Singleton
export class UserController {
  private readonly userStore: UserStore;

  @inject(UserApiService)
  private readonly userApiService: UserApiService;

  async setCurrentUser() {
    const { error, data } = await this.userApiService.getCurrentUser();

    if (error) {
      if (error.message === ExceptionMessageCode.USER_NOT_VERIFIED) {
        router.navigate(constants.path.verify);
        return;
      }

      console.log(error);
    }

    if (data) {
      this.userStore.setUser(data);
    }
  }
}

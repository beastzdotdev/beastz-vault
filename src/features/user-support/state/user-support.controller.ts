import { UserSupportApiService, UserSupportCreateDto } from '../../../shared/api';
import { ClientApiError } from '../../../shared/errors';
import { Inject, Singleton } from '../../../shared/ioc';
import { Calbacks } from '../../../shared/types';
import { toast } from '../../../shared/ui';
import { UserSupport } from '../model/user-support.model';
import { UserSupportStore } from './user-support.store';

@Singleton
export class UserSupportController {
  @Inject(UserSupportStore)
  private readonly userSupportStore: UserSupportStore;

  @Inject(UserSupportApiService)
  private readonly userSupportApiService: UserSupportApiService;

  async createTicket(params: UserSupportCreateDto, cbs?: Calbacks<UserSupport, ClientApiError>) {
    const { data, error } = await this.userSupportApiService.create(params);

    if (error || !data) {
      toast.error(error?.message || 'Sorry, something went wrong');
      cbs?.errorCallback?.(error!);
      return;
    }

    toast.showMessage('Ticket created successfully');
    cbs?.successCallback?.(data);
  }
}

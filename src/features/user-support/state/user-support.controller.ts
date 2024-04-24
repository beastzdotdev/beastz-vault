import { UserSupportApiService, UserSupportCreateDto } from '../../../shared/api';
import { UserSupportTicketStatus } from '../../../shared/enum';
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

  async resolveTicket(id: number, cbs?: Calbacks<UserSupport, ClientApiError>) {
    const { data, error } = await this.userSupportApiService.updateById(id, {
      status: UserSupportTicketStatus.RESOLVED,
    });

    if (error || !data) {
      toast.error(error?.message || 'Sorry, something went wrong');
      cbs?.errorCallback?.(error!);
      return;
    }

    toast.showMessage('Ticket resolved successfully');
    cbs?.successCallback?.(data);

    this.userSupportStore.replaceById(id, data);
  }

  async deleteTicket(id: number, cbs?: Calbacks<undefined, ClientApiError>) {
    const { error } = await this.userSupportApiService.deleteById(id);

    if (error) {
      toast.error(error?.message || 'Sorry, something went wrong');
      cbs?.errorCallback?.(error!);
      return;
    }

    toast.showMessage('Ticket resolved successfully');
    cbs?.successCallback?.();

    window.location.reload();
  }

  async deleteAll(cbs?: Calbacks<undefined, ClientApiError>) {
    const { error } = await this.userSupportApiService.deleteAll();

    if (error) {
      toast.error(error?.message || 'Sorry, something went wrong');
      cbs?.errorCallback?.(error!);
      return;
    }

    toast.showMessage('All ticket deleted successfully');
    cbs?.successCallback?.();

    window.location.reload();
  }
}

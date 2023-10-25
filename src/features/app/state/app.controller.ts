import { inject } from 'inversify';
import { Singleton } from '../../../shared/decorators';
import { AppStore } from './app.store';

@Singleton
export class AppController {
  @inject(AppStore)
  private readonly appStore: AppStore;

  setShouldRender(value: boolean) {
    this.appStore.shouldRender = value;
  }
}

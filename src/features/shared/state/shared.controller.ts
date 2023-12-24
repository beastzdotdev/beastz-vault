import { Singleton, Inject } from '../../../shared';
import { SharedStore } from './shared.store';

@Singleton
export class SharedController {
  @Inject(SharedStore)
  private readonly sharedStore: SharedStore;

  setShouldRender(value: boolean) {
    this.sharedStore.shouldRender = value;
  }
}

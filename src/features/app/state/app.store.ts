import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared/decorators';

@Singleton
export class AppStore {
  shouldRender: boolean;

  constructor() {
    makeAutoObservable(this);
  }
}

import { makeAutoObservable } from 'mobx';
import { User } from '../../../entities/user';
import { Singleton } from '../../../shared';

@Singleton
export class ProfileStore {
  private _user: User;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User) {
    this._user = user;
  }

  get user(): User {
    return this._user;
  }
}
